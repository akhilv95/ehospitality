import { useEffect, useState } from 'react';
import { billingAPI } from '../../services/api';
import toast from 'react-hot-toast';

import {
  CreditCardIcon,
  DocumentTextIcon,
  BanknotesIcon,
  CheckCircleIcon,
  ClockIcon,
  ExclamationCircleIcon,
  CalendarDaysIcon,
  ReceiptPercentIcon,
  ArrowPathIcon,
  BuildingOffice2Icon,
  XMarkIcon,
} from '@heroicons/react/24/outline';


const PatientBilling = () => {
  const [invoices, setInvoices] = useState([]);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [payingInvoice, setPayingInvoice] = useState(null);


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

      setInvoices(
        invoiceRes.data.results ||
        invoiceRes.data ||
        []
      );

      setPayments(
        paymentRes.data.results ||
        paymentRes.data ||
        []
      );

    } catch (error) {

      console.error(
        'Billing error:',
        error.response?.data || error
      );

      toast.error('Failed to load billing data');

    } finally {

      setLoading(false);

    }
  };


  /* =========================================================
     STATUS CONFIGURATION
  ========================================================= */

  const getStatusConfig = (status) => {

    const statuses = {

      paid: {
        label: 'Paid',
        className:
          'bg-green-50 text-green-700 border-green-200',
        icon: CheckCircleIcon,
      },

      partial: {
        label: 'Partially Paid',
        className:
          'bg-yellow-50 text-yellow-700 border-yellow-200',
        icon: ClockIcon,
      },

      pending: {
        label: 'Pending',
        className:
          'bg-orange-50 text-orange-700 border-orange-200',
        icon: ClockIcon,
      },

      overdue: {
        label: 'Overdue',
        className:
          'bg-red-50 text-red-700 border-red-200',
        icon: ExclamationCircleIcon,
      },

    };

    return (
      statuses[status] || {
        label: status || 'Unknown',
        className:
          'bg-gray-50 text-gray-700 border-gray-200',
        icon: ClockIcon,
      }
    );
  };


  /* =========================================================
     STATISTICS
  ========================================================= */

  const totalAmount = invoices.reduce(
    (total, invoice) =>
      total + Number(invoice.total_amount || 0),
    0
  );


  const balanceAmount = invoices.reduce(
    (total, invoice) =>
      total + Number(invoice.balance_due || 0),
    0
  );


  const paidAmount = totalAmount - balanceAmount;


  const paidInvoices = invoices.filter(
    (invoice) => invoice.status === 'paid'
  ).length;


  /* =========================================================
     PAYMENT
  ========================================================= */

  const handleMockPayment = async (invoice) => {

    if (Number(invoice.balance_due) <= 0) {
      return;
    }

    setPayingInvoice(invoice.id);

    try {

      await billingAPI.makePayment({
        invoice: invoice.id,
        amount: Number(invoice.balance_due),
        method: 'upi',
        transaction_id: 'TXN' + Date.now(),
        notes: 'Paid from Patient Portal',
      });

      toast.success('Payment successful');

      await fetchBillingData();

    } catch (error) {

      console.log(
        error.response?.data
      );

      toast.error('Payment failed');

    } finally {

      setPayingInvoice(null);

    }
  };


  /* =========================================================
     LOADING
  ========================================================= */

  if (loading) {

    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">

        <div className="text-center">

          <div
            className="
              w-14
              h-14
              border-4
              border-blue-100
              border-t-blue-600
              rounded-full
              animate-spin
              mx-auto
            "
          />

          <p className="mt-4 text-gray-500 font-medium">
            Loading billing information...
          </p>

        </div>

      </div>
    );
  }


  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8">


      {/* =====================================================
          HEADER
      ===================================================== */}

      <div className="mb-8">

        <div className="flex items-center gap-4">

          <div
            className="
              w-14
              h-14
              bg-blue-100
              rounded-2xl
              flex
              items-center
              justify-center
              flex-shrink-0
            "
          >

            <CreditCardIcon className="w-8 h-8 text-blue-600" />

          </div>

          <div>

            <h1 className="text-3xl font-bold text-gray-900">
              Billing & Payments
            </h1>

            <p className="text-gray-500 mt-1">
              Manage your medical invoices and payment history.
            </p>

          </div>

        </div>

      </div>


      {/* =====================================================
          SUMMARY CARDS
      ===================================================== */}

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-8">


        {/* TOTAL BILLING */}

        <div
          className="
            bg-white
            rounded-2xl
            border
            border-gray-100
            shadow-sm
            p-6
            hover:shadow-md
            transition
          "
        >

          <div className="flex items-center justify-between">

            <div>

              <p className="text-sm font-medium text-gray-500">
                Total Billing
              </p>

              <p className="text-2xl font-bold text-gray-900 mt-2">
                ₹{totalAmount.toFixed(2)}
              </p>

            </div>

            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">

              <ReceiptPercentIcon className="w-6 h-6 text-blue-600" />

            </div>

          </div>

        </div>


        {/* PAID */}

        <div
          className="
            bg-white
            rounded-2xl
            border
            border-gray-100
            shadow-sm
            p-6
            hover:shadow-md
            transition
          "
        >

          <div className="flex items-center justify-between">

            <div>

              <p className="text-sm font-medium text-gray-500">
                Amount Paid
              </p>

              <p className="text-2xl font-bold text-green-600 mt-2">
                ₹{paidAmount.toFixed(2)}
              </p>

            </div>

            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">

              <CheckCircleIcon className="w-6 h-6 text-green-600" />

            </div>

          </div>

        </div>


        {/* BALANCE */}

        <div
          className="
            bg-white
            rounded-2xl
            border
            border-gray-100
            shadow-sm
            p-6
            hover:shadow-md
            transition
          "
        >

          <div className="flex items-center justify-between">

            <div>

              <p className="text-sm font-medium text-gray-500">
                Balance Due
              </p>

              <p className="text-2xl font-bold text-red-600 mt-2">
                ₹{balanceAmount.toFixed(2)}
              </p>

            </div>

            <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">

              <ExclamationCircleIcon className="w-6 h-6 text-red-600" />

            </div>

          </div>

        </div>


        {/* PAID INVOICES */}

        <div
          className="
            bg-white
            rounded-2xl
            border
            border-gray-100
            shadow-sm
            p-6
            hover:shadow-md
            transition
          "
        >

          <div className="flex items-center justify-between">

            <div>

              <p className="text-sm font-medium text-gray-500">
                Paid Invoices
              </p>

              <p className="text-2xl font-bold text-purple-600 mt-2">
                {paidInvoices}
              </p>

            </div>

            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">

              <DocumentTextIcon className="w-6 h-6 text-purple-600" />

            </div>

          </div>

        </div>

      </div>


      {/* =====================================================
          INVOICES
      ===================================================== */}

      <div className="mb-10">

        <div className="flex items-center justify-between mb-5">

          <div>

            <h2 className="text-xl font-bold text-gray-900">
              Invoices
            </h2>

            <p className="text-sm text-gray-500 mt-1">
              Review your hospital bills and outstanding payments.
            </p>

          </div>

          <div className="hidden sm:flex items-center gap-2 text-sm text-gray-400">

            <DocumentTextIcon className="w-5 h-5" />

            {invoices.length} invoice
            {invoices.length !== 1 ? 's' : ''}

          </div>

        </div>


        {invoices.length === 0 ? (

          <div
            className="
              bg-white
              rounded-2xl
              border
              border-gray-100
              shadow-sm
              text-center
              py-14
            "
          >

            <DocumentTextIcon className="w-12 h-12 text-gray-300 mx-auto" />

            <h3 className="text-lg font-bold text-gray-900 mt-4">
              No invoices found
            </h3>

            <p className="text-gray-500 mt-1">
              Your hospital invoices will appear here.
            </p>

          </div>

        ) : (

          <div className="space-y-5">

            {invoices.map((invoice) => {

              const status =
                getStatusConfig(invoice.status);

              const StatusIcon =
                status.icon;

              const isPaying =
                payingInvoice === invoice.id;


              return (

                <div
                  key={invoice.id}
                  className="
                    bg-white
                    rounded-2xl
                    border
                    border-gray-100
                    shadow-sm
                    overflow-hidden
                    hover:shadow-lg
                    hover:border-blue-100
                    transition-all
                  "
                >

                  <div className="h-1 bg-gradient-to-r from-blue-500 to-indigo-500" />

                  <div className="p-5 md:p-7">


                    {/* INVOICE HEADER */}

                    <div
                      className="
                        flex
                        flex-col
                        md:flex-row
                        md:items-start
                        md:justify-between
                        gap-5
                      "
                    >

                      <div>

                        <div className="flex items-center gap-3">

                          <div className="w-11 h-11 bg-blue-50 rounded-xl flex items-center justify-center">

                            <DocumentTextIcon className="w-6 h-6 text-blue-600" />

                          </div>

                          <div>

                            <p className="text-xs text-gray-400 uppercase font-bold tracking-wide">
                              Invoice
                            </p>

                            <h3 className="text-xl font-bold text-blue-700">
                              {invoice.invoice_number}
                            </h3>

                          </div>

                        </div>


                        <div className="mt-4 space-y-2">

                          <div className="flex items-center gap-2 text-sm text-gray-500">

                            <CalendarDaysIcon className="w-4 h-4" />

                            Due Date:
                            <span className="font-semibold text-gray-700">
                              {invoice.due_date || 'N/A'}
                            </span>

                          </div>


                          {invoice.doctor_name && (

                            <div className="flex items-center gap-2 text-sm text-gray-500">

                              <BuildingOffice2Icon className="w-4 h-4" />

                              Doctor:

                              <span className="font-semibold text-gray-700">
                                {invoice.doctor_name}
                              </span>

                            </div>

                          )}

                        </div>

                      </div>


                      {/* STATUS */}

                      <span
                        className={`
                          inline-flex
                          items-center
                          gap-2
                          px-4
                          py-2
                          rounded-full
                          border
                          text-sm
                          font-semibold
                          self-start
                          ${status.className}
                        `}
                      >

                        <StatusIcon className="w-4 h-4" />

                        {invoice.status_display ||
                          status.label}

                      </span>

                    </div>


                    {/* =================================================
                        ITEMS
                    ================================================= */}

                    {invoice.items?.length > 0 && (

                      <div className="mt-7">

                        <h4 className="text-lg font-bold text-gray-900 mb-4">
                          Invoice Items
                        </h4>

                        <div className="border border-gray-100 rounded-xl overflow-hidden">

                          <div className="hidden md:grid grid-cols-12 bg-slate-50 px-5 py-3 text-xs font-bold uppercase tracking-wide text-gray-400">

                            <div className="col-span-6">
                              Description
                            </div>

                            <div className="col-span-2 text-center">
                              Quantity
                            </div>

                            <div className="col-span-2 text-right">
                              Unit Price
                            </div>

                            <div className="col-span-2 text-right">
                              Total
                            </div>

                          </div>


                          {invoice.items.map((item) => (

                            <div
                              key={item.id}
                              className="
                                grid
                                grid-cols-1
                                md:grid-cols-12
                                gap-2
                                md:gap-0
                                px-5
                                py-4
                                border-t
                                border-gray-100
                                hover:bg-slate-50
                                transition
                              "
                            >

                              <div className="md:col-span-6">

                                <p className="font-semibold text-gray-900">
                                  {item.description}
                                </p>

                              </div>


                              <div className="md:col-span-2 md:text-center">

                                <span className="text-sm text-gray-500 md:hidden">
                                  Quantity:{' '}
                                </span>

                                <span className="text-sm text-gray-700">
                                  {item.quantity}
                                </span>

                              </div>


                              <div className="md:col-span-2 md:text-right">

                                <span className="text-sm text-gray-500 md:hidden">
                                  Unit Price:{' '}
                                </span>

                                <span className="text-sm text-gray-700">
                                  ₹{item.unit_price}
                                </span>

                              </div>


                              <div className="md:col-span-2 md:text-right">

                                <span className="text-sm text-gray-500 md:hidden">
                                  Total:{' '}
                                </span>

                                <span className="font-semibold text-gray-900">
                                  ₹{item.total}
                                </span>

                              </div>

                            </div>

                          ))}

                        </div>

                      </div>

                    )}


                    {/* =================================================
                        AMOUNT SUMMARY
                    ================================================= */}

                    <div
                      className="
                        mt-6
                        bg-slate-50
                        rounded-xl
                        p-5
                        border
                        border-gray-100
                      "
                    >

                      <div className="flex justify-between items-center">

                        <span className="text-gray-500">
                          Amount Due
                        </span>

                        <span className="text-2xl font-bold text-gray-900">
                          ₹{invoice.balance_due || '0.00'}
                        </span>

                      </div>

                    </div>


                    {/* =================================================
                        PAYMENT BUTTON
                    ================================================= */}

                    {Number(invoice.balance_due) > 0 && (

                      <div className="mt-5">

                        <button
                          type="button"
                          onClick={() =>
                            handleMockPayment(invoice)
                          }
                          disabled={isPaying}
                          className="
                            w-full
                            sm:w-auto
                            inline-flex
                            items-center
                            justify-center
                            gap-2
                            px-6
                            py-3
                            rounded-xl
                            bg-green-600
                            hover:bg-green-700
                            disabled:bg-green-400
                            text-white
                            font-semibold
                            shadow-sm
                            hover:shadow-md
                            active:scale-[0.98]
                            transition-all
                          "
                        >

                          {isPaying ? (

                            <>
                              <ArrowPathIcon
                                className="
                                  w-5
                                  h-5
                                  animate-spin
                                "
                              />

                              Processing...

                            </>

                          ) : (

                            <>
                              <CreditCardIcon className="w-5 h-5" />

                              Pay ₹{invoice.balance_due}

                            </>

                          )}

                        </button>

                      </div>

                    )}

                  </div>

                </div>

              );
            })}

          </div>

        )}

      </div>


      {/* =====================================================
          PAYMENT HISTORY
      ===================================================== */}

      <div>

        <div className="flex items-center justify-between mb-5">

          <div>

            <h2 className="text-xl font-bold text-gray-900">
              Payment History
            </h2>

            <p className="text-sm text-gray-500 mt-1">
              View your previous transactions.
            </p>

          </div>

          <div className="hidden sm:flex items-center gap-2 text-sm text-gray-400">

            <BanknotesIcon className="w-5 h-5" />

            {payments.length} payment
            {payments.length !== 1 ? 's' : ''}

          </div>

        </div>


        {payments.length === 0 ? (

          <div
            className="
              bg-white
              rounded-2xl
              border
              border-gray-100
              shadow-sm
              text-center
              py-14
            "
          >

            <BanknotesIcon className="w-12 h-12 text-gray-300 mx-auto" />

            <h3 className="text-lg font-bold text-gray-900 mt-4">
              No payments yet
            </h3>

            <p className="text-gray-500 mt-1">
              Your payment transactions will appear here.
            </p>

          </div>

        ) : (

          <div className="space-y-4">

            {payments.map((payment) => (

              <div
                key={payment.id}
                className="
                  bg-white
                  rounded-2xl
                  border
                  border-gray-100
                  shadow-sm
                  p-5
                  hover:shadow-md
                  transition
                "
              >

                <div
                  className="
                    flex
                    flex-col
                    md:flex-row
                    md:items-center
                    md:justify-between
                    gap-5
                  "
                >

                  {/* PAYMENT INFO */}

                  <div className="flex items-center gap-4">

                    <div
                      className="
                        w-12
                        h-12
                        bg-green-50
                        rounded-xl
                        flex
                        items-center
                        justify-center
                      "
                    >

                      <CheckCircleIcon className="w-6 h-6 text-green-600" />

                    </div>

                    <div>

                      <p className="text-xs uppercase tracking-wide text-gray-400 font-bold">
                        Payment
                      </p>

                      <p className="text-xl font-bold text-gray-900 mt-1">
                        ₹{payment.amount}
                      </p>

                    </div>

                  </div>


                  {/* DETAILS */}

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:text-right">

                    <div>

                      <p className="text-xs text-gray-400 font-semibold">
                        Method
                      </p>

                      <p className="text-sm font-semibold text-gray-700 mt-1">
                        {payment.method_display || 'N/A'}
                      </p>

                    </div>


                    <div>

                      <p className="text-xs text-gray-400 font-semibold">
                        Transaction ID
                      </p>

                      <p className="text-sm font-semibold text-gray-700 mt-1 break-all">
                        {payment.transaction_id || 'N/A'}
                      </p>

                    </div>


                    <div>

                      <p className="text-xs text-gray-400 font-semibold">
                        Date
                      </p>

                      <p className="text-sm font-semibold text-gray-700 mt-1">

                        {payment.created_at
                          ? new Date(
                              payment.created_at
                            ).toLocaleDateString(
                              'en-IN',
                              {
                                day: '2-digit',
                                month: 'short',
                                year: 'numeric',
                              }
                            )
                          : 'N/A'}

                      </p>

                    </div>

                  </div>

                </div>

              </div>

            ))}

          </div>

        )}

      </div>

    </div>
  );
};


export default PatientBilling;