All Demo User Images created with [ThisPersonDoesNotExist](https://thispersondoesnotexist.com/). 

![Ekran görüntüsü 2023-10-31 201807](https://github.com/metehnay/expo-react-native-dating-app-and-tailwind-admin-panel/assets/99619400/9b4563c3-0410-4196-aea6-2807fe9642db)
![gif](https://github.com/metehnay/expo-react-native-dating-app-and-tailwind-admin-panel/assets/99619400/3e98e69c-6d30-4141-bdcf-6e44580f7113)


# React Native Dating App and Tailwind Admin Panel

9 Language support and Firebase backend. You can find admin panel on my profile. 

## Content
- [Mobile App Features](#features1)
- [Admin Panel Features](#features2)
- [Installation](#installation)
- [License](#license)

## Features1
- Country and Gender Filtering: For instance, a female user registered from Spain will only see male members from Spain.
- Multilingual Support: Automatic translation based on device language across 9 different languages. Translations are powered by ChatGPT. Any inaccuracies can be rectified through the 'translations' file.
- RevenueCat Integration: To manage your Firebase limits and revenues, message sending has been restricted. After 5 messages, new users are required to purchase a message package.
- Enhanced Chat Experience: Users can send emojis and images to each other.
- Notification Integration: integrated Expo Notification with Firebase FCM to notify new messages. UI enhancements have also been made for incoming messages.
- Sending Likes
- And many more features!

## Features2
- Firebase Data Editor: Bulk delete messages, images, and conversations.
- Detailed Statistical Insights: For instance, statistics such as the number of users who registered in the last 30 days and the last 7 days, and their countries.
- Quick Bot User Creation: All you need to do is change the country for the user. (Automatic form filling is currently active only for Turkish profiles.)
- Send Notifications to All Users: Reach out to your entire user base with announcements or updates.
- Edit and Delete User Information: Admin tools for user data management.

## Installation

Install expo dev client because some of the revenuecat packages doesn't support expo go. 

```
expo install expo-dev-client
```

Change firebaseConfig.tsx file with your firebase config.
`Note: For your own security secure this file in .env!`

```

// Initialize Firebase
const firebaseConfig = {
};

```

Find Premium component in components and change google_id with your revenuecat googleid.
   `Note: If you haven't used revenuecat before. Please follow the Revenuecat document for this step. `

```

// Initialize Firebase
const APIKeys = {
  google: "YOUR GOOGLE  ID",
};

```


## License

Commercial usage is allowed. Just do not sell this project on envato or somewhere! 
