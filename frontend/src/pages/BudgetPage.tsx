import  { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { DollarSign, TrendingUp, CreditCard, ShoppingBag, Coffee, Home, Car, Utensils, Tv, Heart, BookOpen } from 'lucide-react';

const BudgetPage = () => {
  const [timeRange, setTimeRange] = useState('month');

  // Dummy data for categories
  const categories = [
    { name: 'Groceries', spent: 450, budget: 500, icon: ShoppingBag, color: '#3b82f6' },
    { name: 'Coffee', spent: 280, budget: 300, icon: Coffee, color: '#8b5cf6' },
    { name: 'Dining Out', spent: 380, budget: 400, icon: Utensils, color: '#ec4899' },
    { name: 'Transportation', spent: 220, budget: 250, icon: Car, color: '#10b981' },
    { name: 'Entertainment', spent: 150, budget: 200, icon: Tv, color: '#f59e0b' },
    { name: 'Housing', spent: 1800, budget: 1800, icon: Home, color: '#ef4444' },
    { name: 'Healthcare', spent: 120, budget: 200, icon: Heart, color: '#06b6d4' },
    { name: 'Education', spent: 90, budget: 150, icon: BookOpen, color: '#6366f1' },
  ];

  // Monthly spending data
  const monthlyData = [
    { month: 'Jan', spent: 3200 },
    { month: 'Feb', spent: 2800 },
    { month: 'Mar', spent: 3400 },
    { month: 'Apr', spent: 3100 },
    { month: 'May', spent: 3500 },
    { month: 'Jun', spent: 3490 },
  ];

  // Daily spending data for current month
  const dailyData = Array.from({ length: 30 }, (_, i) => ({
    day: i + 1,
    spent: Math.floor(Math.random() * 200) + 50,
  }));

  // Yearly data
  const yearlyData = [
    { year: '2023', spent: 38000 },
    { year: '2024', spent: 41000 },
    { year: '2025', spent: 20500 },
  ];

  // Pie chart data
  const pieData = categories.map(cat => ({
    name: cat.name,
    value: cat.spent,
    color: cat.color,
  }));

  const totalSpent = categories.reduce((sum, cat) => sum + cat.spent, 0);
  const totalBudget = categories.reduce((sum, cat) => sum + cat.budget, 0);
  const percentageUsed = ((totalSpent / totalBudget) * 100).toFixed(1);

  const getDataByTimeRange = () => {
    switch (timeRange) {
      case 'day':
        return dailyData;
      case 'month':
        return monthlyData;
      case 'year':
        return yearlyData;
      default:
        return monthlyData;
    }
  };

  const getXAxisKey = () => {
    switch (timeRange) {
      case 'day':
        return 'day';
      case 'month':
        return 'month';
      case 'year':
        return 'year';
      default:
        return 'month';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-4xl font-bold text-slate-900">Budget Dashboard</h1>
            <p className="text-slate-600 mt-1">Track your spending and stay on budget</p>
          </div>
          <Tabs value={timeRange} onValueChange={setTimeRange} className="w-auto">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="day">Daily</TabsTrigger>
              <TabsTrigger value="month">Monthly</TabsTrigger>
              <TabsTrigger value="year">Yearly</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-white border-slate-200 shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">Total Spent</CardTitle>
              <DollarSign className="h-4 w-4 text-slate-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-slate-900">${totalSpent.toLocaleString()}</div>
              <p className="text-xs text-slate-500 mt-1">This month</p>
            </CardContent>
          </Card>

          <Card className="bg-white border-slate-200 shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">Budget Remaining</CardTitle>
              <CreditCard className="h-4 w-4 text-slate-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">${(totalBudget - totalSpent).toLocaleString()}</div>
              <p className="text-xs text-slate-500 mt-1">{percentageUsed}% of budget used</p>
            </CardContent>
          </Card>

          <Card className="bg-white border-slate-200 shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">vs Last Month</CardTitle>
              <TrendingUp className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-slate-900">+5.2%</div>
              <p className="text-xs text-slate-500 mt-1">$170 more than last month</p>
            </CardContent>
          </Card>
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Spending Trend */}
          <Card className="bg-white border-slate-200 shadow-lg">
            <CardHeader>
              <CardTitle>Spending Trend</CardTitle>
              <CardDescription>Your spending over time</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={getDataByTimeRange()}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey={getXAxisKey()} stroke="#64748b" />
                  <YAxis stroke="#64748b" />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px' }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="spent" 
                    stroke="#3b82f6" 
                    strokeWidth={3}
                    dot={{ fill: '#3b82f6', r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Category Distribution */}
          <Card className="bg-white border-slate-200 shadow-lg">
            <CardHeader>
              <CardTitle>Spending by Category</CardTitle>
              <CardDescription>Distribution across categories</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Categories Breakdown */}
        <Card className="bg-white border-slate-200 shadow-lg">
          <CardHeader>
            <CardTitle>Categories Breakdown</CardTitle>
            <CardDescription>Track spending against your budget for each category</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {categories.map((category, index) => {
                const Icon = category.icon;
                const percentage = (category.spent / category.budget) * 100;
                const isOverBudget = percentage >= 100;
                
                return (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div 
                          className="p-2 rounded-lg"
                          style={{ backgroundColor: `${category.color}20` }}
                        >
                          <Icon className="h-5 w-5" style={{ color: category.color }} />
                        </div>
                        <div>
                          <p className="font-semibold text-slate-900">{category.name}</p>
                          <p className="text-sm text-slate-500">
                            ${category.spent} / ${category.budget}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={`font-bold ${isOverBudget ? 'text-red-600' : 'text-slate-900'}`}>
                          {percentage.toFixed(0)}%
                        </p>
                        <p className="text-xs text-slate-500">
                          ${category.budget - category.spent} left
                        </p>
                      </div>
                    </div>
                    <Progress 
                      value={Math.min(percentage, 100)} 
                      className="h-2"
                      style={{
                        backgroundColor: '#e2e8f0',
                      }}
                    />
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default BudgetPage;