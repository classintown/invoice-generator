interface InvoiceHeaderProps {
  invoiceNumber: string;
  date: string;
  from: {
    name: string;
    address: string;
    email: string;
    pan: string;
  };
}

export const InvoiceHeader = ({ invoiceNumber, date, from }: InvoiceHeaderProps) => {
  return (
    <div className="flex justify-between items-start mb-8 print:mb-6">
      <div>
        <h1 className="text-4xl font-bold text-foreground mb-6 print:mb-4 print:text-3xl">INVOICE</h1>
        <div className="space-y-1 text-sm print:text-sm">
          <p className="font-semibold text-foreground">{from.name}</p>
          <p className="text-muted-foreground">{from.address}</p>
          <p className="text-muted-foreground">{from.email}</p>
          <p className="text-muted-foreground">PAN NO. {from.pan}</p>
        </div>
      </div>
      <div className="text-right text-sm print:text-sm">
        <p className="font-semibold text-foreground">INVOICE NO: {invoiceNumber}</p>
        <p className="text-muted-foreground">DATE: {date}</p>
      </div>
    </div>
  );
};
