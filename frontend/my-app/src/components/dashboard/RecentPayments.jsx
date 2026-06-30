const RecentPayments = ({ payments }) => {

  return (

    <div className="bg-white rounded-2xl shadow-lg p-6">

      <h2 className="text-xl font-bold mb-5">
        Recent Payments
      </h2>

      <div className="space-y-4">

        {payments.slice(0,5).map((payment)=>(
          <div
            key={payment.id}
            className="flex justify-between border-b pb-3"
          >

            <div>

              <h3>
                {payment.method_display}
              </h3>

              <p className="text-gray-500">

                {payment.transaction_id}

              </p>

            </div>

            <div className="text-green-600 font-bold">

              ₹{payment.amount}

            </div>

          </div>
        ))}

      </div>

    </div>

  );

};

export default RecentPayments;