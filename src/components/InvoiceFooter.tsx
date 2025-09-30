interface InvoiceFooterProps {
  bankDetails: {
    accountNumber: string;
    ifscCode: string;
    bankName: string;
    branch: string;
  };
  amountInWords: string;
  signature: string;
  signatureImage?: string;
}

export const InvoiceFooter = ({ bankDetails, amountInWords, signature, signatureImage }: InvoiceFooterProps) => {
  return (
    <div className="space-y-6 print:space-y-4">
      <div className="border border-border rounded-lg p-6 print:p-4 bg-muted/20">
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3 print:mb-2">Bank Account Details</p>
        <div className="grid grid-cols-2 gap-4 print:gap-3 text-sm print:text-sm">
          <div>
            <p className="text-muted-foreground print:text-sm">A/C No: <span className="font-mono text-foreground">{bankDetails.accountNumber}</span></p>
            <p className="text-muted-foreground print:text-sm">Bank: <span className="text-foreground">{bankDetails.bankName}</span></p>
          </div>
          <div>
            <p className="text-muted-foreground print:text-sm">IFSC: <span className="font-mono text-foreground">{bankDetails.ifscCode}</span></p>
            <p className="text-muted-foreground print:text-sm">Branch: <span className="text-foreground">{bankDetails.branch}</span></p>
          </div>
        </div>
      </div>

      {amountInWords && (
        <div>
          <p className="text-sm print:text-sm text-foreground italic">{amountInWords}</p>
        </div>
      )}

      <div className="flex justify-end pt-6 print:pt-4">
        <div className="text-right">
          {signatureImage && (
            <div className="mb-2 print:mb-1 flex justify-end">
              <img src={signatureImage} alt="Signature" className="h-16 print:h-12 w-auto" />
            </div>
          )}
          <p className="text-sm print:text-sm font-semibold text-foreground mb-2 print:mb-1">{signature}</p>
          <div className="border-t border-border pt-2 print:pt-1 w-48 print:w-40">
            <p className="text-xs text-muted-foreground">Authorized Signature</p>
          </div>
        </div>
      </div>
    </div>
  );
};
