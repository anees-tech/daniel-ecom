"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import {
  Award,
  Clock,
  Heart,
  MapPin,
  ShoppingBag,
  Truck,
  Users,
} from "lucide-react";
import HomeLink from "@/components/home-link";
import TextField from "@/components/text-field";
import { doc, getDoc } from "firebase/firestore";
import { firestore } from "@/lib/firebaseConfig";
import Loading from "../loading";

// Define interfaces for our data structure
interface TeamMember {
  id: string;
  name: string;
  role: string;
  bio: string;
  image: string;
}

interface MissionValue {
  id: string;
  title: string;
  description: string;
  icon: string;
}

interface ChooseUsReason {
  id: string;
  title: string;
  description: string;
  icon: string;
}

interface ContactInfo {
  address: {
    line1: string;
    line2: string;
    line3: string;
  };
  hours: {
    weekdays: string;
    saturday: string;
    sunday: string;
  };
  support: {
    email: string;
    phone: string;
    chat: string;
  };
}

interface CTASection {
  title: string;
  description: string;
  buttonText: string;
  buttonLink: string;
}

interface AboutUsData {
  // Our Story Section
  storyTitle: string;
  storyText: string[];
  storyImage: string;

  // Team Section
  teamTitle: string;
  teamDescription: string;
  teamMembers: TeamMember[];

  // Mission Statement Section
  missionTitle: string;
  missionDescription: string;
  missionValues: MissionValue[];

  // Why Choose Us Section
  chooseUsTitle: string;
  chooseUsDescription: string;
  chooseUsReasons: ChooseUsReason[];

  // Contact Info Section
  contactInfo: ContactInfo;

  // CTA Section
  ctaSection: CTASection;
}

// Helper function to render icon based on icon name
const renderIcon = (iconName: string) => {
  switch (iconName) {
    case "heart":
      return <Heart className="w-8 h-8 text-red-600" />;
    case "award":
      return <Award className="w-8 h-8 text-orange-500" />;
    case "truck":
      return <Truck className="w-8 h-8 text-gray-700" />;
    case "users":
      return <Users className="w-8 h-8 text-red-600" />;
    case "shopping-bag":
      return <ShoppingBag className="w-8 h-8 text-orange-500" />;
    case "clock":
      return <Clock className="w-8 h-8 text-red-600" />;
    case "map-pin":
      return <MapPin className="w-8 h-8 text-gray-700" />;
    default:
      return <Heart className="w-8 h-8 text-red-600" />;
  }
};

export default function About() {
  const [aboutData, setAboutData] = useState<AboutUsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAboutData = async () => {
      try {
        const docRef = doc(firestore, "settings", "aboutUs");
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setAboutData(docSnap.data() as AboutUsData);
        } else {
          console.log("No about us data found!");
        }
      } catch (error) {
        console.error("Error fetching about us data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAboutData();
  }, []);

  // Show the loading component while data is being fetched
  if (loading) {
    return <Loading />;
  }

  return (
    <div className="bg-white mt-10">
      <div className="px-2 sm:px-4 md:px-8 lg:px-12 flex flex-row gap-2 text-sm md:text-xl font-small mb-2 capitalize">
        <HomeLink />
        <span className="text-gray-400">/</span>
        <span className="text-red-500">About</span>
      </div>
      <TextField text={"About"} />

      {/* Our Story Section - Dynamic from Firebase */}
      <section className="py-16 md:py-24 px-2 sm:px-4 md:px-8 lg:px-12">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="text-center md:text-left">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">
              {aboutData?.storyTitle || "Our Story"}
            </h2>
            <div className="w-20 h-1 bg-red-600 mb-8 mx-auto md:mx-0"></div>

            {aboutData?.storyText.map((paragraph, index) => (
              <p key={index} className="text-gray-600 mb-6">
                {paragraph}
              </p>
            ))}
          </div>
          <div className="relative h-[400px] rounded-lg overflow-hidden mx-auto w-full">
            <Image
              src={
                aboutData?.storyImage ||
                "/placeholder.svg" ||
                "/placeholder.svg"
              }
              alt="Our Story"
              fill
              className="object-cover"
            />
          </div>
        </div>
      </section>

      {/* Values Section - Dynamic from Firebase */}
      <section className="py-16 bg-gray-100">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">
              {aboutData?.missionTitle || "Mission Statement"}
            </h2>
            <div className="w-20 h-1 bg-orange-500 mx-auto mb-8"></div>
            <p className="text-gray-600 max-w-2xl mx-auto">
              {aboutData?.missionDescription ||
                "These principles guide everything we do and help us deliver an exceptional experience to our customers."}
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {aboutData?.missionValues && aboutData.missionValues.length > 0 ? (
              aboutData.missionValues.map((value) => (
                <div
                  key={value.id}
                  className="bg-white p-8 rounded-lg shadow-md text-center"
                >
                  <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    {renderIcon(value.icon)}
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-4">
                    {value.title}
                  </h3>
                  <p className="text-gray-600">{value.description}</p>
                </div>
              ))
            ) : (
              <>
                <div className="bg-white p-8 rounded-lg shadow-md text-center">
                  <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Heart className="w-8 h-8 text-red-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-4">
                    Customer First
                  </h3>
                  <p className="text-gray-600">
                    We prioritize our customers&apos; needs and strive to exceed
                    their expectations in every interaction.
                  </p>
                </div>

                <div className="bg-white p-8 rounded-lg shadow-md text-center">
                  <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Award className="w-8 h-8 text-orange-500" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-4">
                    Quality
                  </h3>
                  <p className="text-gray-600">
                    We carefully curate our product selection to ensure we offer
                    only the highest quality items.
                  </p>
                </div>

                <div className="bg-white p-8 rounded-lg shadow-md text-center">
                  <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Truck className="w-8 h-8 text-gray-700" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-4">
                    Reliability
                  </h3>
                  <p className="text-gray-600">
                    We deliver on our promises with fast shipping, secure
                    transactions, and dependable service.
                  </p>
                </div>

                <div className="bg-white p-8 rounded-lg shadow-md text-center">
                  <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Users className="w-8 h-8 text-red-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-4">
                    Community
                  </h3>
                  <p className="text-gray-600">
                    We build meaningful relationships with our customers,
                    partners, and the communities we serve.
                  </p>
                </div>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Why Choose Us Section - Dynamic from Firebase */}
      <section className="py-16 md:py-24 container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">
            {aboutData?.chooseUsTitle || "Why Choose Us"}
          </h2>
          <div className="w-20 h-1 bg-red-600 mx-auto mb-8"></div>
          <p className="text-gray-600 max-w-2xl mx-auto">
            {aboutData?.chooseUsDescription ||
              "We're committed to providing you with the best online shopping experience possible."}
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {aboutData?.chooseUsReasons &&
          aboutData.chooseUsReasons.length > 0 ? (
            aboutData.chooseUsReasons.map((reason) => (
              <div
                key={reason.id}
                className="flex flex-col items-center text-center p-6"
              >
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mb-6">
                  {renderIcon(reason.icon)}
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-4">
                  {reason.title}
                </h3>
                <p className="text-gray-600 text-center">
                  {reason.description}
                </p>
              </div>
            ))
          ) : (
            <>
              <div className="flex flex-col items-center text-center p-6">
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mb-6">
                  <ShoppingBag className="w-8 h-8 text-orange-500" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-4">
                  Wide Selection
                </h3>
                <p className="text-gray-600 text-center">
                  Browse thousands of products across multiple categories to
                  find exactly what you need.
                </p>
              </div>

              <div className="flex flex-col items-center text-center p-6">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-6">
                  <Clock className="w-8 h-8 text-red-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-4">
                  Fast Delivery
                </h3>
                <p className="text-gray-600 text-center">
                  Enjoy quick and reliable shipping options to get your
                  purchases delivered right to your doorstep.
                </p>
              </div>

              <div className="flex flex-col items-center text-center p-6">
                <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mb-6">
                  <MapPin className="w-8 h-8 text-gray-700" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-4">
                  Global Reach
                </h3>
                <p className="text-gray-600 text-center">
                  We ship to customers worldwide, bringing our products to
                  shoppers across the globe.
                </p>
              </div>
            </>
          )}
        </div>
      </section>

      {/* Team Section - Dynamic from Firebase */}
      <section className="py-16 bg-gray-100">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">
              {aboutData?.teamTitle || "Meet Our Team"}
            </h2>
            <div className="w-20 h-1 bg-orange-500 mx-auto mb-8"></div>
            <p className="text-gray-600 max-w-2xl mx-auto">
              {aboutData?.teamDescription ||
                "The dedicated professionals behind Daniel's E-commerce who work tirelessly to serve you better."}
            </p>
          </div>

          {aboutData?.teamMembers &&
          aboutData.teamMembers.length > 0 &&
          aboutData.teamMembers[0].name ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {aboutData.teamMembers
                .filter((member) => member.name)
                .map((member) => (
                  <div
                    key={member.id}
                    className="bg-white rounded-lg overflow-hidden shadow-md mx-auto w-full max-w-xs md:max-w-none"
                  >
                    <div className="relative h-64">
                      <Image
                        src={member.image || "/placeholder.svg"}
                        alt={member.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="p-6 text-center md:text-left">
                      <h3 className="text-xl font-semibold text-gray-800 mb-1">
                        {member.name}
                      </h3>
                      <p className="text-orange-500 mb-4">{member.role}</p>
                      <p className="text-gray-600 text-sm">{member.bio}</p>
                    </div>
                  </div>
                ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-white rounded-lg shadow-md max-w-md mx-auto">
              <Image
                src="/empty-box.svg"
                alt="No team members found"
                width={120}
                height={120}
                className="mx-auto mb-4"
              />
              <h3 className="text-xl font-semibold text-gray-700 mb-2">
                No Team Members Found
              </h3>
              <p className="text-gray-500">
                We couldn&apos;t find any team members at the moment.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section - Dynamic from Firebase */}
      <section className="py-16 md:py-24 bg-gradient-to-r from-red-600 to-orange-500 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            {aboutData?.ctaSection?.title || "Ready to Start Shopping?"}
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            {aboutData?.ctaSection?.description ||
              "Join thousands of satisfied customers who trust Daniel's E-commerce for their shopping needs."}
          </p>
          <Link
            href={aboutData?.ctaSection?.buttonLink || "/"}
            className="inline-block bg-white text-red-600 px-8 py-3 rounded-md font-semibold text-lg hover:bg-gray-100 transition duration-300"
          >
            {aboutData?.ctaSection?.buttonText || "Browse Our Products"}
          </Link>
        </div>
      </section>

      {/* Contact Info Section - Dynamic from Firebase */}
      <section className="py-16 container mx-auto px-4">
        <div className="grid md:grid-cols-3 gap-8">
          <div className="text-center p-6">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <MapPin className="w-6 h-6 text-red-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              Our Location
            </h3>
            <p className="text-gray-600 text-center">
              {aboutData?.contactInfo?.address?.line1 || "123 Commerce Street"}
              <br />
              {aboutData?.contactInfo?.address?.line2 || "Suite 500"}
              <br />
              {aboutData?.contactInfo?.address?.line3 || "New York, NY 10001"}
            </p>
          </div>

          <div className="text-center p-6">
            <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Clock className="w-6 h-6 text-orange-500" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              Business Hours
            </h3>
            <p className="text-gray-600 text-center">
              {aboutData?.contactInfo?.hours?.weekdays ||
                "Monday - Friday: 9am - 6pm"}
              <br />
              {aboutData?.contactInfo?.hours?.saturday ||
                "Saturday: 10am - 4pm"}
              <br />
              {aboutData?.contactInfo?.hours?.sunday || "Sunday: Closed"}
            </p>
          </div>

          <div className="text-center p-6">
            <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="w-6 h-6 text-gray-700" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              Customer Support
            </h3>
            <p className="text-gray-600 text-center">
              Email:{" "}
              {aboutData?.contactInfo?.support?.email ||
                "support@danielsecommerce.com"}
              <br />
              Phone:{" "}
              {aboutData?.contactInfo?.support?.phone || "(555) 123-4567"}
              <br />
              Live Chat:{" "}
              {aboutData?.contactInfo?.support?.chat || "Available 24/7"}
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
