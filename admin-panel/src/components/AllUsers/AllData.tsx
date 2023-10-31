import { useEffect, useState } from "react";
import { firebaseApp } from "../../firebaseConfig";
import * as firebase from "firebase/app";
import "firebase/firestore";
import CountryFlag  from "react-country-flag";

const AllData = () => {

  
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalVIPUsers, setTotalVIPUsers] = useState(0);
  const [dailyConversations, setDailyConversations] = useState(0);
  const [usersList, setUsersList] = useState<any[]>([]); // State to store the fetched users
  const [totalMessages, setTotalMessages] = useState(0);

  const getLast7Days = () => {
    const result = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      result.push(d.toLocaleDateString());
    }
    return result;
  };

  
  
  const UserIcon = (props: any) => (
    <svg
      width="50"
      height="50"
      viewBox="0 0 50 50"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props} // This spreads any additional props onto the svg
    >
      <circle cx="25" cy="15" r="12" fill="currentColor" />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M1 50C1 37.1634 11.1634 27 25 27C38.8366 27 49 37.1634 49 50H1Z"
        fill="currentColor"
      />
    </svg>
  );

  const StarIcon = (props: any) => (
    <svg
      width="50"
      height="50"
      viewBox="0 0 50 50"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props} // This spreads any additional props onto the svg
    >
      <path
        d="M25 2L30.4548 18.0455H47.9091L33.8636 29.3182L39.3182 45.3636L25 34.0909L10.6818 45.3636L16.1364 29.3182L2.09091 18.0455H19.5455L25 2Z"
        fill="currentColor"
      />
    </svg>
  );

 const ChatIcon = (props: any) => (
   <svg
     width="50"
     height="50"
     viewBox="0 0 50 50"
     fill="none"
     xmlns="http://www.w3.org/2000/svg"
     {...props} // This spreads any additional props onto the svg
   >
     <path
       d="M25 2C12.2975 2 2 11.2975 2 24C2 36.7025 12.2975 46 25 46V50L39.5 43.5H42.5C46.0898 43.5 49 40.5898 49 37V24C49 11.2975 37.7025 2 25 2Z"
       fill="currentColor"
     />
   </svg>
 );
  
  useEffect(() => {
    const db = firebaseApp.firestore();

    // Total Users
    db.collection("users").onSnapshot((snapshot) => {
      setTotalUsers(snapshot.size);
    });

    // VIP Users
    db.collection("users")
      .where("isVip", "==", true)
      .onSnapshot((snapshot) => {
        setTotalVIPUsers(snapshot.size);
      });

    // Total Messages
    db.collection("messages").onSnapshot((snapshot) => {
      setTotalMessages(snapshot.size);
    });

    // Daily Conversations
    db.collection("conversations").onSnapshot((snapshot) => {
      setDailyConversations(snapshot.size);
    });

    // Fetch latest 20 users
    db.collection("users")
      .orderBy("registeredTime", "desc")
      .limit(20)
      .onSnapshot((snapshot) => {
        setUsersList(snapshot.docs.map((doc) => doc.data()));
      });
  }, []);

const flagMap: { [code: string]: string } = {
  TR: "🇹🇷",
  US: "🇺🇸",
  GB: "🇬🇧",
  // ... add other countries as needed
};

const getFlag = (regionCode: string) => {
  return flagMap[regionCode.toUpperCase()] || regionCode;
};

  return (
    <div className="text-gray-200 w-full p-8 bg-gray-900">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Total Users */}
        <div className="bg-yellow-600 p-6 rounded-lg flex items-center justify-between shadow-md">
          <div className="flex items-center space-x-4">
            <UserIcon className="text-yellow-300" />
            <div>
              <p className="text-sm font-medium">Total Users</p>
              <p className="text-2xl mt-2">{totalUsers}</p>
            </div>
          </div>
        </div>
        {/* Total Messages */}
        <div className="bg-purple-600 p-6 rounded-lg flex items-center justify-between shadow-md">
          <div className="flex items-center space-x-4">
            <ChatIcon className="text-purple-300" />
            <div>
              <p className="text-sm font-medium">Total Messages</p>
              <p className="text-2xl mt-2">{totalMessages}</p>
            </div>
          </div>
        </div>
        {/* Total VIP Users */}
        <div className="bg-green-600 p-6 rounded-lg flex items-center justify-between shadow-md">
          <div className="flex items-center space-x-4">
            <StarIcon className="text-green-300" />
            <div>
              <p className="text-sm font-medium">Total VIP Users</p>
              <p className="text-2xl mt-2">{totalVIPUsers}</p>
            </div>
          </div>
        </div>
        {/* Total Conversations */}
        <div className="bg-blue-600 p-6 rounded-lg flex items-center justify-between shadow-md">
          <div className="flex items-center space-x-4">
            <ChatIcon className="text-blue-300" />
            <div>
              <p className="text-sm font-medium">Total Conversations</p>
              <p className="text-2xl mt-2">{dailyConversations}</p>
            </div>
          </div>
        </div>
        {/* Latest 20 users table */}
        <div className="mt-8 col-span-full bg-gray-800 text-gray-300 p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-extrabold mb-6 text-gray-100 border-b pb-3">
            👥 Latest Users
          </h2>
          <table className="w-full table-auto border-collapse">
            <thead>
              <tr className="bg-gray-700 text-gray-400">
                <th className="px-4 py-3 border-b">📸 Image</th>
                <th className="px-4 py-3 border-b">📛 Full Name</th>
                <th className="px-4 py-3 border-b">💌 Email</th>
                <th className="px-4 py-3 border-b">🕰️ Registered Time</th>
                <th className="px-4 py-3 border-b">🌍 Region Code</th>
              </tr>
            </thead>
            <tbody>
              {usersList.map((user) => {
                // Convert the registeredTime to a readable format
                const date = new Date(user.registeredTime);
                const formattedDate = `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;

                return (
                  <tr
                    key={user.id}
                    className="hover:bg-gray-700 transition ease-in-out duration-150 text-gray-300"
                  >
                    <td className="border px-4 py-2">
                      <img
                        src={user.imageUrl}
                        alt="User"
                        className="w-10 h-10 rounded-full mx-auto"
                      />
                    </td>
                    <td className="border px-4 py-2">{user.fullName}</td>
                    <td className="border px-4 py-2">{user.email}</td>
                    <td className="border px-4 py-2">{formattedDate}</td>
                    <td className="border px-4 py-2">
                      <span>
                        <CountryFlag
                          countryCode={user.regionCode}
                          svg
                          style={{
                            width: "1.5em",
                            height: "1.5em",
                            marginRight: "0.5em",
                          }}
                        />
                        {user.regionCode}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AllData;
