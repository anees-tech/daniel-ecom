"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {  onAuthStateChanged } from "firebase/auth";
import {
  doc,
  getDoc,
  updateDoc,
  setDoc,
} from "firebase/firestore";
import {ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Label } from "@/components/ui/label";
import { Loader2, Camera, User } from "lucide-react";
import firebaseConfig, { auth, firestore, storage } from "@/lib/firebaseConfig";

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [profileData, setProfileData] = useState({
    name: "",
    email: "",
    streetAddress: "",
    streetAddress2: "",
    city: "",
    state: "",
    postalCode: "",
    country: "",
    profileImage: "",
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  useEffect(() => {
    // First check if user data exists in local storage
    const checkLocalStorageAuth = () => {
      try {
        // Look for Firebase auth data in local storage
        const localStorageKey = `firebase:authUser:${firebaseConfig}:[DEFAULT]`;
        const storedUser = localStorage.getItem(localStorageKey);

        if (storedUser) {
          const userData = JSON.parse(storedUser);
          setUser(userData);
          fetchUserProfile(userData.uid);
          setLoading(false);
          return true;
        }
        return false;
      } catch (error) {
        console.error("Error checking local storage auth:", error);
        return false;
      }
    };

    // If local storage check doesn't find a user, use Firebase Auth listener
    if (!checkLocalStorageAuth()) {
      const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
        if (currentUser) {
          setUser(currentUser);
          await fetchUserProfile(currentUser.uid);
        } else {
          router.push("/login");
        }
        setLoading(false);
      });

      return () => unsubscribe();
    }
  }, [router]);

  // Update the fetchUserProfile function to create a user document if it doesn't exist
  const fetchUserProfile = async (uid: string) => {
    try {
      const userDocRef = doc(firestore, "users", uid);
      const userDoc = await getDoc(userDocRef);

      if (userDoc.exists()) {
        const userData = userDoc.data();
        setProfileData({
          name: userData.name || "",
          email: userData.email || user?.email || "",
          streetAddress: userData.streetAddress || "",
          streetAddress2: userData.streetAddress2 || "",
          city: userData.city || "",
          state: userData.state || "",
          postalCode: userData.postalCode || "",
          country: userData.country || "",
          profileImage: userData.profileImage || "",
        });
      } else {
        // Create a new user document if it doesn't exist
        const newUserData = {
          name: user?.displayName || "",
          email: user?.email || "",
          streetAddress: "",
          streetAddress2: "",
          city: "",
          state: "",
          postalCode: "",
          country: "",
          profileImage: user?.photoURL || "",
          createdAt: new Date(),
        };

        // Set initial profile data from auth
        setProfileData({
          name: newUserData.name,
          email: newUserData.email,
          streetAddress: "",
          streetAddress2: "",
          city: "",
          state: "",
          postalCode: "",
          country: "",
          profileImage: newUserData.profileImage,
        });

        // Create the user document in Firestore
        await setDoc(userDocRef, newUserData);
      }
    } catch (error) {
      console.error("Error fetching user profile:", error);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Update the handleSubmit function to handle the case where the user document doesn't exist yet
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setUpdating(true);
    try {
      let imageUrl = profileData.profileImage;

      // Upload new image if selected
      if (imageFile) {
        const storageRef = ref(storage, `profile-images/${user.uid}`);
        await uploadBytes(storageRef, imageFile);
        imageUrl = await getDownloadURL(storageRef);
      }

      // Prepare user data
      const userData = {
        name: profileData.name,
        email: profileData.email,
        streetAddress: profileData.streetAddress,
        streetAddress2: profileData.streetAddress2,
        city: profileData.city,
        state: profileData.state,
        postalCode: profileData.postalCode,
        country: profileData.country,
        profileImage: imageUrl,
        updatedAt: new Date(),
      };

      // Check if document exists first
      const userDocRef = doc(firestore, "users", user.uid);
      const userDoc = await getDoc(userDocRef);

      if (userDoc.exists()) {
        // Update existing document
        await updateDoc(userDocRef, userData);
      } else {
        // Create new document with all fields
        await setDoc(userDocRef, {
          ...userData,
          createdAt: new Date(),
        });
      }

      setProfileData((prev) => ({
        ...prev,
        profileImage: imageUrl,
      }));

      alert("Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Failed to update profile. Please try again.");
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-white">
        <Loader2 className="h-8 w-8 animate-spin text-red-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white p-4 md:p-8">
      <Card className="mx-auto max-w-2xl border-red-100 shadow-md">
        <CardHeader className=" text-white">
          <CardTitle className="text-center text-2xl font-bold">
            My Profile
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex flex-col items-center justify-center">
              <div className="relative mb-4">
                <Avatar className="h-24 w-24 border-2 border-red-600">
                  <AvatarImage
                    src={
                      imagePreview ||
                      profileData.profileImage ||
                      "/placeholder.svg?height=96&width=96"
                    }
                    alt="Profile"
                  />
                  <AvatarFallback className="bg-red-100 text-red-600">
                    <User className="h-12 w-12" />
                  </AvatarFallback>
                </Avatar>
                <label
                  htmlFor="profile-image"
                  className="absolute bottom-0 right-0 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-red-600 text-white hover:bg-red-700"
                >
                  <Camera className="h-4 w-4" />
                  <input
                    id="profile-image"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageChange}
                  />
                </label>
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-gray-700">
                  Full Name
                </Label>
                <Input
                  id="name"
                  name="name"
                  value={profileData.name}
                  onChange={handleInputChange}
                  className="border-red-200 focus:border-red-400 focus:ring-red-400"
                  placeholder="Your full name"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-700">
                  Email
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={profileData.email}
                  onChange={handleInputChange}
                  className="border-red-200 focus:border-red-400 focus:ring-red-400"
                  placeholder="Your email address"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="streetAddress" className="text-gray-700">
                  Street Address
                </Label>
                <Input
                  id="streetAddress"
                  name="streetAddress"
                  value={profileData.streetAddress}
                  onChange={handleInputChange}
                  className="border-red-200 focus:border-red-400 focus:ring-red-400"
                  placeholder="Street address"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="streetAddress2" className="text-gray-700">
                  Apartment, suite, etc. (optional)
                </Label>
                <Input
                  id="streetAddress2"
                  name="streetAddress2"
                  value={profileData.streetAddress2}
                  onChange={handleInputChange}
                  className="border-red-200 focus:border-red-400 focus:ring-red-400"
                  placeholder="Apartment, suite, unit, etc. (optional)"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="city" className="text-gray-700">
                    City
                  </Label>
                  <Input
                    id="city"
                    name="city"
                    value={profileData.city}
                    onChange={handleInputChange}
                    className="border-red-200 focus:border-red-400 focus:ring-red-400"
                    placeholder="City"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="state" className="text-gray-700">
                    State / Province
                  </Label>
                  <Input
                    id="state"
                    name="state"
                    value={profileData.state}
                    onChange={handleInputChange}
                    className="border-red-200 focus:border-red-400 focus:ring-red-400"
                    placeholder="State / Province"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="postalCode" className="text-gray-700">
                    Postal / ZIP Code
                  </Label>
                  <Input
                    id="postalCode"
                    name="postalCode"
                    value={profileData.postalCode}
                    onChange={handleInputChange}
                    className="border-red-200 focus:border-red-400 focus:ring-red-400"
                    placeholder="Postal / ZIP code"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="country" className="text-gray-700">
                    Country
                  </Label>
                  <Input
                    id="country"
                    name="country"
                    value={profileData.country}
                    onChange={handleInputChange}
                    className="border-red-200 focus:border-red-400 focus:ring-red-400"
                    placeholder="Country"
                  />
                </div>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full bg-red-600 text-white hover:bg-red-700"
              disabled={updating}
            >
              {updating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Updating...
                </>
              ) : (
                "Update Profile"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
