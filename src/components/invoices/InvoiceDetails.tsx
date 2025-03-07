
import React from 'react';
import { Invoice, PaymentStatus } from '@/lib/types';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Download, Printer, Copy } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';

interface InvoiceDetailsProps {
  invoice: Invoice;
}

const InvoiceDetails: React.FC<InvoiceDetailsProps> = ({ invoice }) => {
  const { toast } = useToast();

  const getStatusColor = (status: PaymentStatus) => {
    switch (status) {
      case PaymentStatus.PAID:
        return 'bg-green-100 text-green-800';
      case PaymentStatus.PENDING:
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleCopyDetails = () => {
    const details = `
      Invoice #${invoice.id}
      Date: ${format(invoice.date, 'PPP')}
      Party: ${invoice.partyName}
      Material: ${invoice.material}
      Amount: ₹${invoice.netAmount.toLocaleString()}
    `;
    
    navigator.clipboard.writeText(details);
    
    toast({
      title: "Copied to clipboard",
      description: "Invoice details have been copied to clipboard",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-2xl font-semibold">Invoice #{invoice.id}</h2>
          <p className="text-muted-foreground">
            {format(invoice.date, 'PPP')}
          </p>
        </div>
        <span className={`${getStatusColor(invoice.paymentStatus)} px-3 py-1 rounded-full text-sm font-medium`}>
          {invoice.paymentStatus}
        </span>
      </div>

      <Separator />

      {/* Main invoice details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4">
        <div>
          <h3 className="text-sm font-medium text-muted-foreground">Party Details</h3>
          <p className="font-medium">{invoice.partyName}</p>
          <p className="text-sm">Party ID: {invoice.partyId}</p>
        </div>

        <div>
          <h3 className="text-sm font-medium text-muted-foreground">Material Details</h3>
          <p className="font-medium">{invoice.material}</p>
          <p className="text-sm">Quantity: {invoice.quantity}</p>
          <p className="text-sm">Rate: ₹{invoice.rate.toLocaleString()}</p>
        </div>

        <div>
          <h3 className="text-sm font-medium text-muted-foreground">Created By</h3>
          <p>{invoice.createdBy}</p>
          <p className="text-sm">On {format(invoice.createdAt, 'PPP')}</p>
        </div>

        <div>
          <h3 className="text-sm font-medium text-muted-foreground">Amount Details</h3>
          <p className="text-sm">Gross Amount: ₹{invoice.grossAmount.toLocaleString()}</p>
          <p className="text-sm">GST ({invoice.gstPercentage}%): ₹{(invoice.netAmount - invoice.grossAmount).toLocaleString()}</p>
          <p className="font-semibold">Total: ₹{invoice.netAmount.toLocaleString()}</p>
        </div>
      </div>

      <Separator />

      {/* Bank details */}
      <div>
        <h3 className="text-lg font-medium mb-2">Bank Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-y-3 gap-x-6">
          <div>
            <h4 className="text-sm font-medium text-muted-foreground">Account Number</h4>
            <p>{invoice.bankDetails.accountNumber}</p>
          </div>
          <div>
            <h4 className="text-sm font-medium text-muted-foreground">Bank Name</h4>
            <p>{invoice.bankDetails.bankName}</p>
          </div>
          <div>
            <h4 className="text-sm font-medium text-muted-foreground">IFSC Code</h4>
            <p>{invoice.bankDetails.ifscCode}</p>
          </div>
          <div>
            <h4 className="text-sm font-medium text-muted-foreground">Contact</h4>
            <p>{invoice.bankDetails.email || 'N/A'}</p>
            <p>{invoice.bankDetails.mobile || 'N/A'}</p>
          </div>
        </div>
      </div>

      {/* Bill attachment */}
      {invoice.billUrl && (
        <>
          <Separator />
          <div>
            <h3 className="text-lg font-medium mb-2">Bill Attachment</h3>
            <div className="border rounded-md p-4">
              <div className="flex items-center justify-between">
                <p className="text-sm">Bill_{invoice.id}.pdf</p>
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </Button>
              </div>
            </div>
          </div>
        </>
      )}

      <div className="flex justify-between items-center pt-4">
        <Button variant="outline" onClick={handleCopyDetails}>
          <Copy className="h-4 w-4 mr-2" />
          Copy Details
        </Button>
        
        <div className="space-x-2">
          <Button variant="outline">
            <Printer className="h-4 w-4 mr-2" />
            Print
          </Button>
          {invoice.paymentStatus === PaymentStatus.PENDING && (
            <Button>
              Process Payment
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default InvoiceDetails;
