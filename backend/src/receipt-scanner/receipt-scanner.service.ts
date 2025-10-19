import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SpendingCategory } from '../spending_categories/entities/spending_category.entity';
import { Transaction } from '../transactions/entities/transaction.entity';

@Injectable()
export class ReceiptScannerService {
  private readonly GOOGLE_API_KEY = 'AIzaSyD58FoIsQmhooSAmR3O5PdgsSlz1ZY99c0';

  constructor(
    @InjectRepository(SpendingCategory)
    private categoryRepository: Repository<SpendingCategory>,
    @InjectRepository(Transaction)
    private transactionRepository: Repository<Transaction>,
  ) {}

  async extractTextFromImage(imageBase64: string): Promise<string> {
    try {
      // Remove data URL prefix if present
      const base64Data = imageBase64.includes(',') ? imageBase64.split(',')[1] : imageBase64;
      
      const response = await fetch(
        `https://vision.googleapis.com/v1/images:annotate?key=${this.GOOGLE_API_KEY}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            requests: [
              {
                image: {
                  content: base64Data,
                },
                features: [
                  {
                    type: 'TEXT_DETECTION',
                    maxResults: 1,
                  },
                ],
              },
            ],
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Google Vision API Error:', errorData);
        throw new Error(`API Error: ${response.status} - ${errorData.error?.message || 'Unknown error'}`);
      }

      const data = await response.json();
      console.log('Google Vision API Response:', data);
      
      if (data.responses && data.responses[0] && data.responses[0].textAnnotations) {
        return data.responses[0].textAnnotations[0].description;
      }
      
      throw new Error('No text found in image');
    } catch (error) {
      console.error('Error calling Google Vision API:', error);
      throw error;
    }
  }

  async categorizeReceiptText(receiptText: string): Promise<{
    categorizedItems: Array<{
      item: string;
      amount: number;
      category: string;
      confidence: number;
    }>;
    totalAmount: number;
    categoriesCreated: string[];
  }> {
    const lines = receiptText.split('\n');
    const items: Array<{
      item: string;
      amount: number;
      category: string;
      confidence: number;
    }> = [];
    let totalAmount = 0;

    // Category keywords mapping
    const categoryKeywords = {
      'Groceries': [
        'milk', 'bread', 'bananas', 'chicken', 'eggs', 'pasta', 'tomatoes', 'cheese',
        'grocery', 'food', 'produce', 'meat', 'dairy', 'bakery', 'cereal', 'snacks',
        'vegetables', 'fruits', 'fish', 'beef', 'pork', 'yogurt', 'butter', 'rice',
        'beans', 'nuts', 'cookies', 'chips', 'soda', 'juice', 'water', 'coffee',
        'organic', 'whole', 'greek', 'apples', 'gala'
      ],
      'Gas & Transportation': [
        'gas', 'fuel', 'gasoline', 'petrol', 'diesel', 'oil', 'lube', 'car wash',
        'parking', 'toll', 'uber', 'lyft', 'taxi', 'bus', 'train', 'metro'
      ],
      'Restaurants & Dining': [
        'restaurant', 'cafe', 'coffee', 'pizza', 'burger', 'sandwich', 'salad',
        'diner', 'fast food', 'delivery', 'takeout', 'bar', 'pub', 'grill',
        'starbucks', 'latte', 'muffin', 'croissant'
      ],
      'Entertainment': [
        'movie', 'theater', 'cinema', 'concert', 'show', 'game', 'sports',
        'netflix', 'spotify', 'streaming', 'subscription', 'ticket', 'event'
      ],
      'Shopping': [
        'clothing', 'shirt', 'pants', 'shoes', 'jacket', 'dress', 'electronics',
        'phone', 'computer', 'tablet', 'accessories', 'jewelry', 'watch'
      ],
      'Health & Medical': [
        'pharmacy', 'medicine', 'prescription', 'doctor', 'hospital', 'clinic',
        'vitamins', 'supplements', 'medical', 'health', 'dental', 'vision'
      ],
      'Home & Utilities': [
        'rent', 'mortgage', 'electricity', 'water', 'gas bill', 'internet',
        'cable', 'phone bill', 'insurance', 'maintenance', 'repair', 'cleaning'
      ],
      'Personal Care': [
        'shampoo', 'soap', 'toothpaste', 'deodorant', 'makeup', 'skincare',
        'razor', 'shaving', 'cosmetics', 'hygiene', 'beauty', 'haircut'
      ]
    };

    const categorizeItem = (itemName: string): { category: string; confidence: number } => {
      const lowerItemName = itemName.toLowerCase();
      
      for (const [category, keywords] of Object.entries(categoryKeywords)) {
        for (const keyword of keywords) {
          if (lowerItemName.includes(keyword)) {
            return { category, confidence: 0.9 };
          }
        }
      }
      
      return { category: 'Miscellaneous', confidence: 0.3 };
    };

    // Parse receipt items
    for (const line of lines) {
      // Look for lines with item names and prices
      const itemMatch = line.match(/([a-zA-Z\s]+?)\s+\$(\d+\.\d{2})$/);
      
      if (itemMatch) {
        const itemName = itemMatch[1].trim();
        const amount = parseFloat(itemMatch[2]);
        
        // Skip totals and subtotals
        if (!itemName.toLowerCase().includes('total') && 
            !itemName.toLowerCase().includes('subtotal') &&
            !itemName.toLowerCase().includes('tax')) {
          
          const { category, confidence } = categorizeItem(itemName);
          
          items.push({
            item: itemName,
            amount: amount,
            category,
            confidence
          });
          
          totalAmount += amount;
        }
      }
    }

    return {
      categorizedItems: items,
      totalAmount,
      categoriesCreated: [...new Set(items.map(item => item.category))]
    };
  }

  async getAvailableCategories(): Promise<{ categories: string[] }> {
    return {
      categories: ['Groceries', 'Gas & Transportation', 'Restaurants & Dining', 'Entertainment', 'Shopping', 'Health & Medical', 'Home & Utilities', 'Personal Care']
    };
  }
}