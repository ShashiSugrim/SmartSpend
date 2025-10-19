import { Controller, Post, Body } from '@nestjs/common';
import { ReceiptScannerService } from './receipt-scanner.service';

export interface ReceiptScanRequest {
  imageBase64: string;
}

export interface ReceiptScanResponse {
  success: boolean;
  message: string;
  extractedText?: string;
  categorizedItems?: Array<{
    item: string;
    amount: number;
    category: string;
    confidence: number;
  }>;
  totalAmount?: number;
  categoriesCreated?: string[];
}

@Controller('scanner')
export class ReceiptScannerController {
  constructor(private readonly receiptScannerService: ReceiptScannerService) {}

  @Post('scan-image')
  async scanReceiptImage(@Body() request: ReceiptScanRequest): Promise<ReceiptScanResponse> {
    try {
      // Extract text from image using Google Vision API
      const extractedText = await this.receiptScannerService.extractTextFromImage(request.imageBase64);
      
      // Categorize the extracted text
      const result = await this.receiptScannerService.categorizeReceiptText(extractedText);
      
      return {
        success: true,
        message: `Successfully processed receipt with ${result.categorizedItems.length} items`,
        extractedText,
        categorizedItems: result.categorizedItems,
        totalAmount: result.totalAmount,
        categoriesCreated: result.categoriesCreated
      };
    } catch (error) {
      return {
        success: false,
        message: `Error processing receipt: ${error.message}`,
      };
    }
  }
}