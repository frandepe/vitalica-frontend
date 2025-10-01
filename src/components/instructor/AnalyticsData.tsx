import { useState } from "react";
import { Button } from "../ui/button";

export const AnalyticsData = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [progress] = useState(75);

  const circumference = 2 * Math.PI * 20;
  const strokeDashoffset = circumference - (circumference * progress) / 100;
  //   avgRating
  //   totalStudents
  //   totalCourses
  // approvedAt

  return (
    <div className="mt-8 md:w-[600px]">
      <div className="flex items-start justify-between mb-8">
        <div>
          <h2 className="text-2xl font-semibold mb-1">Analíticas</h2>
          <p className="text-sm">Performance metrics at a glance</p>
        </div>
        <div className="flex items-center gap-4">
          {/* Progress Ring */}
          <div className="relative">
            <svg
              width="60"
              height="60"
              className="animate-[float_3s_ease-in-out_infinite]"
            >
              <defs>
                <linearGradient
                  id="gradient"
                  x1="0%"
                  y1="0%"
                  x2="100%"
                  y2="100%"
                >
                  <stop offset="0%" stopColor="var(--primary)" />
                  <stop offset="100%" stopColor="#aff5b5" />
                </linearGradient>
              </defs>
              <circle
                cx="30"
                cy="30"
                r="20"
                fill="none"
                stroke="currentColor"
                strokeWidth="4"
                className="text-gray-200"
              />
              <circle
                cx="30"
                cy="30"
                r="20"
                fill="none"
                stroke="url(#gradient)"
                strokeWidth="4"
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                className="transition-all duration-500 -rotate-90 origin-center"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-sm font-semibold text-gray-700">
                {progress}%
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="mb-6">
        <div className="flex space-x-1 relative border-b border-gray-200">
          {["overview", "analytics", "reports"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 text-sm font-medium capitalize transition-colors relative z-10 ${
                activeTab === tab
                  ? "text-blue-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {tab}
            </button>
          ))}
          <div
            className="absolute bottom-0 h-0.5 bg-gradient-to-r from-secondary to-primary-liht transition-all duration-300 ease-in-out"
            style={{
              left:
                activeTab === "overview"
                  ? "0px"
                  : activeTab === "analytics"
                  ? "96px"
                  : "192px",
              width: "96px",
            }}
          />
        </div>
      </div>

      {/* Tab Content */}
      <div className="space-y-4">
        {activeTab === "overview" && (
          <>
            <div className="rounded-lg p-4 border bg-gray-50 border-gray-100">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-600">Monthly Revenue</span>
                <span className="text-xs px-2 py-1 rounded-full text-primary bg-green-50">
                  +12.5%
                </span>
              </div>
              <p className="text-2xl font-semibold text-gray-900">$24,780</p>
              <div className="mt-3 h-1.5 rounded-full overflow-hidden bg-gray-200">
                <div className="h-full bg-gradient-to-r from-secondary to-primary-light rounded-full transition-all duration-500" />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              {[
                { label: "Users", value: "1,428" },
                { label: "Sessions", value: "3,942" },
                { label: "Conversion", value: "4.2%" },
              ].map((metric) => (
                <div
                  key={metric.label}
                  className="rounded-lg p-3 border bg-gray-50 border-gray-100"
                >
                  <p className="text-xs mb-1 text-gray-500">{metric.label}</p>
                  <p className="text-lg font-semibold text-gray-800">
                    {metric.value}
                  </p>
                </div>
              ))}
            </div>
          </>
        )}

        {activeTab === "analytics" && (
          <div className="space-y-3">
            {[
              { color: "bg-secondary", label: "Page Views", value: "45,293" },
              {
                color: "bg-primary",
                label: "Unique Visitors",
                value: "12,847",
              },
              { color: "bg-green-500", label: "Bounce Rate", value: "32.4%" },
              {
                color: "bg-amber-500",
                label: "Avg. Session",
                value: "3m 42s",
              },
            ].map((item, index) => (
              <div
                key={item.label}
                className={`flex items-center justify-between py-3 ${
                  index < 3 ? "border-b border-gray-100" : ""
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className={`w-2 h-2 rounded-full ${item.color}`}></div>
                  <span className="text-sm text-gray-700">{item.label}</span>
                </div>
                <span className="text-sm font-medium text-gray-900">
                  {item.value}
                </span>
              </div>
            ))}
          </div>
        )}

        {activeTab === "reports" && (
          <div className="space-y-3">
            <div className="rounded-lg p-4 border bg-gradient-to-r from-blue-50 to-purple-50 border-gray-100">
              <h3 className="text-sm font-medium mb-2 text-gray-900">
                Weekly Summary
              </h3>
              <p className="text-xs leading-relaxed text-gray-600">
                Performance increased by 23% compared to last week. User
                engagement metrics show positive trends across all channels.
              </p>
            </div>
            <div className="rounded-lg p-4 border bg-gray-50 border-gray-100">
              <h3 className="text-sm font-medium mb-2 text-gray-900">
                Key Insights
              </h3>
              <ul className="space-y-2">
                {[
                  "Mobile traffic up 18%",
                  "Peak hours: 2-4 PM EST",
                  "Top source: Organic search",
                ].map((insight) => (
                  <li key={insight} className="flex items-start space-x-2">
                    <span className="text-xs mt-0.5 text-gray-400">•</span>
                    <span className="text-xs text-gray-600">{insight}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>

      {/* Buttons */}
      <div className="mt-8 flex gap-3">
        <Button>View Details</Button>
        <Button variant="outline">Export</Button>
      </div>
    </div>
  );
};
