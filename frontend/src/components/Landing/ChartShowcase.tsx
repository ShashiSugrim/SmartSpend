import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { BarChart, Bar, PieChart, Pie, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { TrendingUp, Edit3, Check } from "lucide-react";

/* Use the SVG-safe HSL tokens */
const COLORS = [
    "var(--svg-chart-1)",
    "var(--svg-chart-2)",
    "var(--svg-chart-3)",
    "var(--svg-chart-4)",
    "var(--svg-chart-5)",
];

const ChartShowcase = () => {
    const [isEditing, setIsEditing] = useState(false);
    const [chartData, setChartData] = useState([
        { name: "Groceries", value: 850, color: COLORS[0] },
        { name: "Dining", value: 420, color: COLORS[1] },
        { name: "Transport", value: 320, color: COLORS[2] },
        { name: "Entertainment", value: 280, color: COLORS[3] },
        { name: "Shopping", value: 530, color: COLORS[4] },
    ]);

    const handleValueChange = (index: number, newValue: string) => {
        const updated = [...chartData];
        updated[index].value = parseInt(newValue) || 0;
        setChartData(updated);
    };

    const handleNameChange = (index: number, newName: string) => {
        const updated = [...chartData];
        updated[index].name = newName;
        setChartData(updated);
    };

    return (
        <section className="py-24 px-4 bg-gradient-hero relative overflow-hidden">
            {/* OKLCH glow using raw triplet for alpha */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,oklch(var(--primary-raw)/0.06),transparent_70%)]" />

            <div className="container mx-auto max-w-6xl relative z-10">
                <div className="text-center space-y-4 mb-16 animate-fade-in">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 border border-accent/20 backdrop-blur-sm mb-4">
                        <TrendingUp className="w-4 h-4 text-accent" />
                        <span className="text-sm font-medium text-accent">Live Dashboard Preview</span>
                    </div>
                    <h2 className="text-4xl md:text-5xl font-bold">
                        Your finances,<span className="bg-clip-text text-transparent bg-gradient-accent"> visualized beautifully</span>
                    </h2>
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                        Interactive charts that update in real-time. Click Edit to customize the data below!
                    </p>
                </div>

                <Card className="p-8 shadow-lg border-2 animate-scale-in bg-card/80 backdrop-blur-md">
                    <div className="flex justify-between items-center mb-8">
                        <h3 className="text-2xl font-bold">Monthly Spending Breakdown</h3>
                        <Button onClick={() => setIsEditing(!isEditing)} variant={isEditing ? "default" : "outline"} className="gap-2">
                            {isEditing ? (<><Check className="w-4 h-4" />Done</>) : (<><Edit3 className="w-4 h-4" />Edit Data</>)}
                        </Button>
                    </div>

                    {isEditing && (
                        <Card className="p-6 mb-8 bg-secondary/50 border-dashed animate-fade-in">
                            <h4 className="font-semibold mb-4 text-lg">Edit Chart Data</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {chartData.map((item, index) => (
                                    <div key={index} className="flex gap-3">
                                        <div className="flex-1">
                                            <Label className="text-xs mb-1">Category</Label>
                                            <Input value={item.name} onChange={(e) => handleNameChange(index, e.target.value)} className="h-9" />
                                        </div>
                                        <div className="w-28">
                                            <Label className="text-xs mb-1">Amount ($)</Label>
                                            <Input type="number" value={item.value} onChange={(e) => handleValueChange(index, e.target.value)} className="h-9" />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </Card>
                    )}

                    <div className="grid md:grid-cols-2 gap-8">
                        {/* Bar Chart */}
                        <div className="space-y-4">
                            <h4 className="font-semibold text-lg">Category Spending</h4>
                            <ResponsiveContainer width="100%" height={300}>
                                <BarChart data={chartData}>
                                    <XAxis
                                        dataKey="name"
                                        tick={{ fill: "var(--svg-muted-foreground)" }}
                                        axisLine={{ stroke: "var(--svg-border)" }}
                                    />
                                    <YAxis
                                        tick={{ fill: "var(--svg-muted-foreground)" }}
                                        axisLine={{ stroke: "var(--svg-border)" }}
                                    />
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: "var(--svg-card)",
                                            border: "1px solid var(--svg-border)",
                                            borderRadius: "8px",
                                            color: "var(--svg-foreground)",
                                        }}
                                    />
                                    <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                                        {chartData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>

                        {/* Pie Chart */}
                        <div className="space-y-4">
                            <h4 className="font-semibold text-lg">Budget Distribution</h4>
                            <ResponsiveContainer width="100%" height={300}>
                                <PieChart>
                                    <Pie
                                        data={chartData}
                                        cx="50%"
                                        cy="50%"
                                        labelLine={false}
                                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                        outerRadius={100}
                                        dataKey="value"
                                    >
                                        {chartData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Pie>
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: "var(--svg-card)",
                                            border: "1px solid var(--svg-border)",
                                            borderRadius: "8px",
                                            color: "var(--svg-foreground)",
                                        }}
                                    />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Summary Stats */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 pt-8 border-t">
                        <div className="text-center">
                            <div className="text-3xl font-bold text-primary">
                                ${chartData.reduce((sum, item) => sum + item.value, 0)}
                            </div>
                            <div className="text-sm text-muted-foreground">Total Spending</div>
                        </div>
                        <div className="text-center">
                            <div className="text-3xl font-bold text-accent">
                                ${Math.max(...chartData.map(d => d.value))}
                            </div>
                            <div className="text-sm text-muted-foreground">Highest Category</div>
                        </div>
                        <div className="text-center">
                            <div className="text-3xl font-bold text-chart-3">
                                ${(chartData.reduce((sum, item) => sum + item.value, 0) / chartData.length).toFixed(0)}
                            </div>
                            <div className="text-sm text-muted-foreground">Average</div>
                        </div>
                        <div className="text-center">
                            <div className="text-3xl font-bold text-chart-4">
                                {chartData.length}
                            </div>
                            <div className="text-sm text-muted-foreground">Categories</div>
                        </div>
                    </div>
                </Card>
            </div>
        </section>
    );
};

export default ChartShowcase;
