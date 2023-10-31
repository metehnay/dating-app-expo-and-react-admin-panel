import React, { useState, ChangeEvent, FormEvent } from "react";
import "firebase/auth";
import "firebase/storage";
import { firebaseApp } from "../../firebaseConfig";
import { Input } from "./../UI/CustomInput";
import { hobbiesList, turkishCities, turkishGirlBios, turkishGirlNames } from "./data";
import Compressor from "compressorjs";

const UserCreation: React.FC = () => {
 const possibleRegionCodes = [
   "TR",
   "US",
   "EN",
   "IT",
   "DE",
   "ES",
   "FR",
   "PT",
   "ZH",
   "AR",
   "IN",
   "BR",
   "HI",
 ];
  const [email, setEmail] = useState<string>("");
  const [gender, setGender] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [fullName, setFullName] = useState<string>("");
const [isBotUser, setIsBotUser] = useState(true);
const [expoPushToken, setExpoPushToken] = useState<string>(
  "ExponentPushToken[PADFIRO1d4HAwkxIVzdGCB]"
);
  const [height, setHeight] = useState<string>("");
  const [weight, setWeight] = useState<string>("");
  const [city, setCity] = useState<string>("");
  const [birthDate, setBirthDate] = useState<string>("");
  const [image, setImage] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null); // Declare imageUrl here
  const [hobbies, setHobbies] = useState<string[]>([]);
const [regionCode, setRegionCode] = useState<string>("TR");


const [loading, setLoading] = useState(false);

  const formFields = [
    { type: "email", placeholder: "Email", value: email, setter: setEmail },

    { placeholder: "Full Name", value: fullName, setter: setFullName },
    {
      placeholder: "Region Codes (comma-separated)", // This will trigger the dropdown
      value: regionCode,
      setter: setRegionCode,
    },
    { placeholder: "City", value: city, setter: setCity },
    { placeholder: "Height", value: height, setter: setHeight },
    { placeholder: "Weight", value: weight, setter: setWeight },
    { placeholder: "Gender", value: gender, setter: setGender },
    {
      placeholder: "Hobbies (comma-separated)", // or use a multi-select or other input method
      value: hobbies.join(", "),
      setter: (hobbyString: string) =>
        setHobbies(hobbyString.split(", ").map((hobby) => hobby.trim())),
    },
    {
      placeholder: "Birth Date (D-M-Y)",
      value: birthDate,
      setter: setBirthDate,
    },
  ];



   
   
  const shuffleArray = (array: string[]) => {
    let currentIndex = array.length,
      randomIndex;

    // While there remain elements to shuffle...
    while (currentIndex !== 0) {
      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;

      // And swap it with the current element.
      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex],
        array[currentIndex],
      ];
    }

    return array;
  };

  const generateRandomData = () => {
    // Generate random data for form fields
    setEmail("ex123" + Math.floor(Math.random() * 95990) + "@example.com");
    setPassword("442442");

    // Generate random Turkish eye color

    // Generate random Turkish hair color


    // Generate random birth date between 1970 and 2023
    const randomYear = Math.floor(Math.random() * (2004 - 1985)) + 1985;
    const randomMonth = String(Math.floor(Math.random() * 12) + 1).padStart(
      2,
      "0"
    );
    const randomDay = String(Math.floor(Math.random() * 31) + 1).padStart(
      2,
      "0"
    );
    setBirthDate(`${randomDay}-${randomMonth}-${randomYear}`);

   

    setFullName(
      turkishGirlNames[Math.floor(Math.random() * turkishGirlNames.length)]
    );

    const randomHeight = Math.floor(Math.random() * (181 - 155 + 1)) + 155;
    setHeight(randomHeight.toString());

    // Generate random weight between 50 and 80
    const randomWeight = Math.floor(Math.random() * (80 - 50 + 1)) + 50;
    setWeight(randomWeight.toString());
    setGender("female");
    

    // Select a random city
    const randomCity =
      turkishCities[Math.floor(Math.random() * turkishCities.length)];
    setCity(randomCity);

    
    const shuffledHobbies = shuffleArray([...hobbiesList]);
    const randomHobbies = shuffledHobbies.slice(0, 5);
    setHobbies(randomHobbies);
  
    
  };

  const handleImageUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files ? event.target.files[0] : null;

    if (file) {
      setLoading(true);

      new Compressor(file, {
        quality: 0.6,
        maxWidth: 800,
        mimeType: "image/jpeg",
        success: (compressedFile) => {
          const storageRef = firebaseApp
            .storage()
            .ref(`user-images/resized/${file.name}`); // Use the original file's name here

          const uploadTask = storageRef.put(compressedFile);

          uploadTask.on(
            "state_changed",
            (snapshot) => {
              // Handle progress if necessary
            },
            (error) => {
              console.error("Failed to upload image:", error);
              setLoading(false);
              setError("Failed to upload image");
            },
            async () => {
              const downloadURL =
                await uploadTask.snapshot.ref.getDownloadURL();
              setImageUrl(downloadURL);
              setLoading(false);
            }
          );
        },
        error(err) {
          console.error(err.message);
        },
      });
    }
  };


    const handleSignUp = async (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      const registeredTime = new Date().toISOString(); // Get the current time in ISO string format

      try {
        const userCredential = await firebaseApp
          .auth()
          .createUserWithEmailAndPassword(email, password);

        if (userCredential.user) {
          const userDocRef = firebaseApp
            .firestore()
            .collection("users")
            .doc(userCredential.user.uid);
          await userDocRef.set({
            id: userCredential.user.uid,
            email: email, // <-- Add this line
            fullName: fullName,
            isBotUser: true,
            expoPushToken: expoPushToken,
            height: height,
            weight: weight,
            regionCode: regionCode,
            hobbies: hobbies,
            registeredTime: registeredTime,
            city: city,
            gender: gender,
            imageUrl: imageUrl, // Use the imageUrl from the state
            birthDate: birthDate,
          });
        }

        setEmail("");
        setPassword("");
        setFullName("");

        setHeight("");
        setWeight("");
        setBirthDate("");
        setImage(null);
        setError(null);
        setHobbies([]);
        setImageUrl(null); // Clear the imageUrl state
      } catch (error) {
        console.log(error);
      }
    };

  return (
    <div className="w-full mx-auto p-8 space-y-8 bg-gray-900 text-gray-200 shadow-lg">
      {error && (
        <div className="bg-red-800 p-4 rounded-lg text-red-100 flex items-center space-x-2">
          <span className="material-icons-outlined text-red-300">error</span>
          <p className="font-semibold">{error}</p>
        </div>
      )}

      <form onSubmit={handleSignUp} className="space-y-4">
        {formFields.map((field, index) => (
          <div className="relative border-2 border-gray-700 hover:border-blue-500 transition rounded-lg">
            {field.placeholder === "Region Codes (comma-separated)" ? (
              <select
                className="w-full p-3 bg-black outline-none placeholder-black-500 text-black-200"
                value={regionCode}
                onChange={(e) => setRegionCode(e.target.value)}
              >
                {possibleRegionCodes.map((code) => (
                  <option key={code} value={code}>
                    {code}
                  </option>
                ))}
              </select>
            ) : (
              <Input
                key={index}
                type={field.type}
                placeholder={field.placeholder}
                value={field.value}
                onChange={(e) => field.setter(e.target.value)}
                className="w-full p-3 bg-transparent outline-none placeholder-gray-500 text-gray-200"
              />
            )}
          </div>
        ))}

        <div className="bg-gray-800 p-1 rounded-lg border-2 border-gray-700 hover:border-blue-500 transition">
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="w-full p-2 text-blue-500 outline-none bg-transparent"
          />
        </div>

        <button
          type="button"
          onClick={generateRandomData}
          className="w-full py-3 text-lg font-bold bg-yellow-600 hover:bg-yellow-700 text-gray-900 rounded-lg shadow-md transition-all ease-in-out duration-300"
        >
          ⚡ Auto Generate ⚡
        </button>
        <button
          type="submit"
          className={`w-full py-3 text-lg font-bold rounded-lg shadow-md transition-transform ease-in-out duration-300 ${
            loading
              ? "bg-gray-700 text-gray-400 cursor-wait"
              : "bg-green-600 hover:bg-green-700 text-gray-200"
          }`}
          disabled={!imageUrl || loading}
        >
          {loading ? "🔄 Uploading..." : "✅ Create User ✅"}
        </button>
      </form>
    </div>
  );
};

export default UserCreation;
