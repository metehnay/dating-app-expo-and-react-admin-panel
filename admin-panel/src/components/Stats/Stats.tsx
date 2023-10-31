import React, { useState, useEffect } from "react";
import { firebaseApp } from "../../firebaseConfig";
import * as firebase from "firebase/app";
import "firebase/firestore";
import CountryFlag from "react-country-flag";

const Stats = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    vipUsers: 0,
    totalConversations: 0,
    totalMessages: 0,
  });

  const [usersLast7Days, setUsersLast7Days] = useState(0);
  const [usersToday, setUsersToday] = useState(0);
  const [usersThisMonth, setUsersThisMonth] = useState(0);
  const [usersByRegion, setUsersByRegion] = useState<Record<string, number>>(
    {}
  );

  useEffect(() => {
    const db = firebaseApp.firestore();
    const today = new Date();
    const startOfDay = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate()
    );
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const sevenDaysAgo = new Date(today);
    sevenDaysAgo.setDate(today.getDate() - 7);

    // Total Users
    db.collection("users").onSnapshot((snapshot) => {
      setStats((prevState) => ({ ...prevState, totalUsers: snapshot.size }));
    });

    // VIP Users
    db.collection("users")
      .where("isVip", "==", true)
      .onSnapshot((snapshot) => {
        setStats((prevState) => ({ ...prevState, vipUsers: snapshot.size }));
      });

    // Total Messages
    db.collection("messages").onSnapshot((snapshot) => {
      setStats((prevState) => ({ ...prevState, totalMessages: snapshot.size }));
    });

    // Total Conversations
    db.collection("conversations").onSnapshot((snapshot) => {
      setStats((prevState) => ({
        ...prevState,
        totalConversations: snapshot.size,
      }));
    });

    // Users registered Today
    db.collection("users")
      .where("registeredTime", ">=", startOfDay.toISOString())
      .onSnapshot((snapshot) => {
        setUsersToday(snapshot.size);
      });

    // Users registered This Month
    db.collection("users")
      .where("registeredTime", ">=", startOfMonth.toISOString())
      .onSnapshot((snapshot) => {
        setUsersThisMonth(snapshot.size);
      });

    // Users in the Last 7 Days
    db.collection("users")
      .where("registeredTime", ">=", sevenDaysAgo.toISOString())
      .onSnapshot((snapshot) => {
        setUsersLast7Days(snapshot.size);
      });

    // Users by RegionCode
    db.collection("users").onSnapshot((snapshot) => {
      const regionCounts: Record<string, number> = {};
      snapshot.docs.forEach((doc) => {
        const regionCode = doc.data().regionCode;
        if (regionCounts[regionCode]) {
          regionCounts[regionCode] += 1;
        } else {
          regionCounts[regionCode] = 1;
        }
      });
      setUsersByRegion(regionCounts);
    });
  }, []);

  return (
    <div className="p-8 bg-gray-900 text-gray-100 h-screen w-full">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl mb-8 font-bold border-b border-gray-700 pb-4 text-center">
          📊 Dashboard Stats
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Total Users */}
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg flex items-center justify-between">
            <div>
              <h2 className="text-xl mb-4 font-medium">📝 Total Users</h2>
              <p className="text-3xl">{stats.totalUsers}</p>
            </div>
            <div className="text-6xl">👥</div>
          </div>

          {/* VIP Users */}
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg flex items-center justify-between">
            <div>
              <h2 className="text-xl mb-4 font-medium">⭐ VIP Users</h2>
              <p className="text-3xl">{stats.vipUsers}</p>
            </div>
            <div className="text-6xl">🎖️</div>
          </div>

          {/* Total Conversations */}
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg flex items-center justify-between">
            <div>
              <h2 className="text-xl mb-4 font-medium">
                💬 Total Conversations
              </h2>
              <p className="text-3xl">{stats.totalConversations}</p>
            </div>
            <div className="text-6xl">🔊</div>
          </div>

          {/* Total Messages */}
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg flex items-center justify-between">
            <div>
              <h2 className="text-xl mb-4 font-medium">💌 Total Messages</h2>
              <p className="text-3xl">{stats.totalMessages}</p>
            </div>
            <div className="text-6xl">📩</div>
          </div>

          {/* Registered Last 7 Days */}
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg flex items-center justify-between">
            <div>
              <h2 className="text-xl mb-4 font-medium">
                📅 Registered Last 7 Days
              </h2>
              <p className="text-3xl">{usersLast7Days}</p>
            </div>
            <div className="text-6xl">🗓️</div>
          </div>

          {/* Users Today */}
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg flex items-center justify-between">
            <div>
              <h2 className="text-xl mb-4 font-medium">📆 Users Today</h2>
              <p className="text-3xl">{usersToday}</p>
            </div>
            <div className="text-6xl">📅</div>
          </div>

          {/* Users This Month */}
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg flex items-center justify-between">
            <div>
              <h2 className="text-xl mb-4 font-medium">📆 Users This Month</h2>
              <p className="text-3xl">{usersThisMonth}</p>
            </div>
            <div className="text-6xl">🗓️</div>
          </div>

          {/* Users By Region */}
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
            <h2 className="text-xl mb-4 font-medium">🌍 Users By Region</h2>
            {Object.entries(usersByRegion).map(([region, count]) => (
              <div key={region} className="mt-2 flex items-center">
                <CountryFlag
                  countryCode={region}
                  svg
                  style={{
                    width: "1.5em",
                    height: "1.5em",
                    marginRight: "0.5em",
                  }}
                />
                <span className="font-medium mr-2">{region}: </span>
                <span>{count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Stats;
