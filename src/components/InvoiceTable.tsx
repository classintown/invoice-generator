interface InvoiceItem {
  description: string;
  amount: number;
}

interface InvoiceTableProps {
  items: InvoiceItem[];
}

export const InvoiceTable = ({ items }: InvoiceTableProps) => {
  const total = items.reduce((sum, item) => sum + item.amount, 0);

  return (
    <div className="mb-8 print:mb-6">
      <div className="border-t border-b border-border">
        <div className="grid grid-cols-2 py-3 print:py-2 border-b border-border">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide print:text-sm">Description</p>
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide text-right print:text-sm">Amount</p>
        </div>
        {items.map((item, index) => (
          <div key={index} className="grid grid-cols-2 py-3 print:py-2 border-b border-border">
            <p className="text-sm print:text-sm text-foreground">{item.description}</p>
            <p className="text-sm print:text-sm text-foreground text-right font-mono">
              ₹{item.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
            </p>
          </div>
        ))}
        <div className="grid grid-cols-2 py-3 print:py-2 bg-muted/30">
          <p className="text-sm print:text-sm font-semibold text-foreground">Total</p>
          <p className="text-sm print:text-sm font-bold text-foreground text-right font-mono">
            ₹{total.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
          </p>
        </div>
      </div>
    </div>
  );
};
