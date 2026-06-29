import { useEffect, useState } from 'react';
import { billingAPI } from '../../services/api';
import toast from 'react-hot-toast';

const PatientBilling = () => {
  const [invoices, setInvoices] = useState([]);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBillingData();
  }, []);

  const fetchBillingData = async () => {
    setLoading(true);
    try {
      const [invoiceRes, paymentRes] = await Promise.all([
        billingAPI.getInvoices(),
        billingAPI.getPayments(),
      ]);

      setInvoices(invoiceRes.data.results || invoiceRes.data || []);
      setPayments(paymentRes.data.results || paymentRes.data || []);
    } catch (error) {
      toast.error('Failed to load billing data');
    } finally {
      setLoading(false);
    }
  };




  const getStatusBadge = (status) => {
    if (status === 'paid') return 'badge-success';
    if (status === 'partial') return 'badge-warning';
    if (status === 'pending' || status === 'overdue') return 'badge-danger';
    return 'badge-info';
  };

  const handleMockPayment = async (invoice) => {
  try {
    await billingAPI.makePayment({
      invoice: invoice.id,
      amount: Number(invoice.balance_due),
      method: "upi",
      transaction_id: "TXN" + Date.now(),
      notes: "Paid from Patient Portal",
    });

    toast.success("Payment Successful");

    fetchBillingData();
  } catch (error) {
    console.log(error.response?.data);
    toast.error("Payment Failed");
  }
};

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Billing & Payments</h1>
        <p className="text-gray-600">Track invoices and payment history.</p>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-900">Invoices</h2>

        {invoices.length === 0 ? (
          <div className="card">
            <p className="text-gray-500">No invoices found.</p>
          </div>
        ) : (
          invoices.map((invoice) => (
            <div key={invoice.id} className="card">
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-2">
                  <p className="text-gray-900">
                    <span className="font-semibold">Invoice:</span> {invoice.invoice_number}
                  </p>
                  <p className="text-gray-700">
                    <span className="font-semibold">Total:</span> {invoice.total}
                  </p>
                  <p className="text-gray-700">
                    <span className="font-semibold">Paid:</span> {invoice.amount_paid}
                  </p>
                  <p className="text-gray-700">
                    <span className="font-semibold">Balance:</span> {invoice.balance_due}
                  </p>
                  <p className="text-gray-700">
                    <span className="font-semibold">Due Date:</span> {invoice.due_date}
                  </p>
                </div>

                <span className={getStatusBadge(invoice.status)}>
                  {invoice.status_display}
                </span>
              </div>

              {invoice.items?.length > 0 && (
                <div className="mt-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Items</h3>
                  <div className="space-y-2">
                    {invoice.items.map((item) => (
                      <div key={item.id} className="bg-gray-50 rounded-lg p-3">
                        <p className="font-medium text-gray-900">{item.description}</p>
                        <p className="text-sm text-gray-600">
                          Qty: {item.quantity} x {item.unit_price} = {item.total}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {Number(invoice.balance_due) > 0 && (
                <button
  onClick={() => handleMockPayment(invoice)}
  className="mt-4 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg"
>
  Pay ₹{invoice.balance_due}
</button>
              )}
            </div>
          ))
        )}
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-900">Payment History</h2>

        {payments.length === 0 ? (
          <div className="card">
            <p className="text-gray-500">No payments found.</p>
          </div>
        ) : (
          payments.map((payment) => (
            <div key={payment.id} className="card">
              <p className="text-gray-900">
                <span className="font-semibold">Amount:</span> {payment.amount}
              </p>
              <p className="text-gray-700">
                <span className="font-semibold">Method:</span> {payment.method_display}
              </p>
              <p className="text-gray-700">
                <span className="font-semibold">Transaction ID:</span> {payment.transaction_id || 'N/A'}
              </p>
              <p className="text-gray-700">
                <span className="font-semibold">Date:</span> {payment.created_at}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default PatientBilling;
