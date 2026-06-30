import {
BellIcon,
UserPlusIcon,
CalendarDaysIcon,
CurrencyRupeeIcon
} from "@heroicons/react/24/outline";

const NotificationPanel=()=>{

const notifications=[

{
icon:<UserPlusIcon className="h-6"/>,
text:"New patient registered"
},

{
icon:<CalendarDaysIcon className="h-6"/>,
text:"Appointment completed"
},

{
icon:<CurrencyRupeeIcon className="h-6"/>,
text:"Invoice paid"
},

{
icon:<BellIcon className="h-6"/>,
text:"Doctor schedule updated"
}

];

return(

<div className="bg-white rounded-2xl shadow-lg p-6">

<h2 className="text-xl font-bold mb-5">

Notifications

</h2>

<div className="space-y-5">

{notifications.map((item,index)=>(

<div
key={index}
className="flex gap-3 items-center border-b pb-3"
>

{item.icon}

<p>{item.text}</p>

</div>

))}

</div>

</div>

);

};

export default NotificationPanel;