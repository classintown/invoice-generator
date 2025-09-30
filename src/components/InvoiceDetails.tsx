interface InvoiceDetailsProps {
  billTo: {
    name: string;
    address: string;
  };
  paymentMode: string;
}

export const InvoiceDetails = ({ billTo, paymentMode }: InvoiceDetailsProps) => {
  return (
    <div className="mb-8 print:mb-6 space-y-6 print:space-y-4">
      <div>
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2 print:mb-1">Bill To</p>
        <p className="font-semibold text-foreground">{billTo.name}</p>
        <p className="text-sm text-muted-foreground">{billTo.address}</p>
      </div>
      <div>
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2 print:mb-1">Payment Mode</p>
        <p className="text-sm text-foreground">{paymentMode}</p>
      </div>
    </div>
  );
};
