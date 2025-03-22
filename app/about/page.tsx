import Image from "next/image";
import Link from "next/link";
import {
  Award,
  Clock,
  Heart,
  MapPin,
  ShoppingBag,
  Truck,
  Users,
} from "lucide-react";

export default function About() {
  console.log("About Us page is rendering");
  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="relative h-[400px] md:h-[500px] overflow-hidden">
        <div className="absolute inset-0 bg-gray-900/60 z-10"></div>
        <Image
          src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1200&h=500&q=80"
          alt="About Us Hero"
          fill
          className="object-cover"
          priority
        />
        <div className="relative z-20 container mx-auto px-4 h-full flex flex-col justify-center items-center text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
            About Our Story
          </h1>
          <p className="text-lg md:text-xl text-white max-w-2xl">
            Discover the journey behind Daniel's E-commerce and our commitment
            to excellence
          </p>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="py-16 md:py-24 container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">
              Our Story
            </h2>
            <div className="w-20 h-1 bg-red-600 mb-8"></div>
            <p className="text-gray-600 mb-6">
              Founded in 2015, Daniel's E-commerce began with a simple mission:
              to provide customers with high-quality products at affordable
              prices. What started as a small online store has grown into a
              trusted marketplace serving thousands of satisfied customers
              worldwide.
            </p>
            <p className="text-gray-600 mb-6">
              Our founder, Daniel, recognized a gap in the market for an
              e-commerce platform that truly puts customers first. With a
              background in retail and technology, he assembled a team of
              passionate individuals who shared his vision for creating an
              exceptional shopping experience.
            </p>
            <p className="text-gray-600">
              Today, we continue to innovate and expand our offerings while
              staying true to our core values of quality, affordability, and
              customer satisfaction.
            </p>
          </div>
          <div className="relative h-[400px] rounded-lg overflow-hidden">
            <Image
              src="https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=600&h=400&q=80"
              alt="Our Story"
              fill
              className="object-cover"
            />
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 bg-gray-100">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">
              Our Core Values
            </h2>
            <div className="w-20 h-1 bg-orange-500 mx-auto mb-8"></div>
            <p className="text-gray-600 max-w-2xl mx-auto">
              These principles guide everything we do and help us deliver an
              exceptional experience to our customers.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-white p-8 rounded-lg shadow-md text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Heart className="w-8 h-8 text-red-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-4">
                Customer First
              </h3>
              <p className="text-gray-600">
                We prioritize our customers' needs and strive to exceed their
                expectations in every interaction.
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
                We build meaningful relationships with our customers, partners,
                and the communities we serve.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-16 md:py-24 container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">
            Why Choose Us
          </h2>
          <div className="w-20 h-1 bg-red-600 mx-auto mb-8"></div>
          <p className="text-gray-600 max-w-2xl mx-auto">
            We're committed to providing you with the best online shopping
            experience possible.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="flex flex-col items-center text-center p-6">
            <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mb-6">
              <ShoppingBag className="w-8 h-8 text-orange-500" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-4">
              Wide Selection
            </h3>
            <p className="text-gray-600">
              Browse thousands of products across multiple categories to find
              exactly what you need.
            </p>
          </div>

          <div className="flex flex-col items-center text-center p-6">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-6">
              <Clock className="w-8 h-8 text-red-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-4">
              Fast Delivery
            </h3>
            <p className="text-gray-600">
              Enjoy quick and reliable shipping options to get your purchases
              delivered right to your doorstep.
            </p>
          </div>

          <div className="flex flex-col items-center text-center p-6">
            <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mb-6">
              <MapPin className="w-8 h-8 text-gray-700" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-4">
              Global Reach
            </h3>
            <p className="text-gray-600">
              We ship to customers worldwide, bringing our products to shoppers
              across the globe.
            </p>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 bg-gray-100">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">
              Meet Our Team
            </h2>
            <div className="w-20 h-1 bg-orange-500 mx-auto mb-8"></div>
            <p className="text-gray-600 max-w-2xl mx-auto">
              The dedicated professionals behind Daniel's E-commerce who work
              tirelessly to serve you better.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-white rounded-lg overflow-hidden shadow-md">
              <div className="relative h-64">
                <Image
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=300&h=300&q=80"
                  alt="Daniel Johnson"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-1">
                  Daniel Johnson
                </h3>
                <p className="text-orange-500 mb-4">Founder & CEO</p>
                <p className="text-gray-600 text-sm">
                  With over 15 years of experience in retail and e-commerce,
                  Daniel leads our company with vision and passion.
                </p>
              </div>
            </div>

            <div className="bg-white rounded-lg overflow-hidden shadow-md">
              <div className="relative h-64">
                <Image
                  src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=300&h=300&q=80"
                  alt="Sarah Martinez"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-1">
                  Sarah Martinez
                </h3>
                <p className="text-orange-500 mb-4">Chief Operations Officer</p>
                <p className="text-gray-600 text-sm">
                  Sarah ensures our operations run smoothly and efficiently to
                  deliver the best customer experience.
                </p>
              </div>
            </div>

            <div className="bg-white rounded-lg overflow-hidden shadow-md">
              <div className="relative h-64">
                <Image
                  src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=300&h=300&q=80"
                  alt="Michael Chen"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-1">
                  Michael Chen
                </h3>
                <p className="text-orange-500 mb-4">Head of Technology</p>
                <p className="text-gray-600 text-sm">
                  Michael leads our tech team in developing and maintaining our
                  cutting-edge e-commerce platform.
                </p>
              </div>
            </div>

            <div className="bg-white rounded-lg overflow-hidden shadow-md">
              <div className="relative h-64">
                <Image
                  src="https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=300&h=300&q=80"
                  alt="Emily Wilson"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-1">
                  Emily Wilson
                </h3>
                <p className="text-orange-500 mb-4">
                  Customer Experience Manager
                </p>
                <p className="text-gray-600 text-sm">
                  Emily and her team work tirelessly to ensure every customer
                  interaction exceeds expectations.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 bg-gradient-to-r from-red-600 to-orange-500 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Start Shopping?
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Join thousands of satisfied customers who trust Daniel's E-commerce
            for their shopping needs.
          </p>
          <Link
            href="/"
            className="inline-block bg-white text-red-600 px-8 py-3 rounded-md font-semibold text-lg hover:bg-gray-100 transition duration-300"
          >
            Browse Our Products
          </Link>
        </div>
      </section>

      {/* Contact Info Section */}
      <section className="py-16 container mx-auto px-4">
        <div className="grid md:grid-cols-3 gap-8">
          <div className="text-center p-6">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <MapPin className="w-6 h-6 text-red-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              Our Location
            </h3>
            <p className="text-gray-600">
              123 Commerce Street
              <br />
              Suite 500
              <br />
              New York, NY 10001
            </p>
          </div>

          <div className="text-center p-6">
            <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Clock className="w-6 h-6 text-orange-500" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              Business Hours
            </h3>
            <p className="text-gray-600">
              Monday - Friday: 9am - 6pm
              <br />
              Saturday: 10am - 4pm
              <br />
              Sunday: Closed
            </p>
          </div>

          <div className="text-center p-6">
            <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="w-6 h-6 text-gray-700" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              Customer Support
            </h3>
            <p className="text-gray-600">
              Email: support@danielsecommerce.com
              <br />
              Phone: (555) 123-4567
              <br />
              Live Chat: Available 24/7
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
