<!-- Old code of career page -->


<!-- {/* <div className="px-4 md:px-8 py-4 space-y-6"> */}
      {/* <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Welcome Card */}
      {/* <div className="lg:col-span-2 card-gradient rounded-lg overflow-hidden shadow-lg">
        <div className="flex flex-col md:flex-row">
          <div className="p-6 md:p-8 flex flex-col justify-center">
            <h1 className="text-3xl md:text-4xl font-bold mb-2">
              Hello, Robert
            </h1>
            <p className="text-slate-300 mb-6">Welcome Back to Level up CRM</p>
            <div className="flex items-center gap-2">
              <div className="p-2 bg-blue-900 rounded-lg">
                <Star className="w-6 h-6 text-blue-400" />
              </div>
              <span className="text-xl font-bold">Level 3: Rising Star</span>
            </div>
          </div>
          <div className="hidden md:block">
            <Image
              src="/placeholder.svg?height=200&width=200"
              width={200}
              height={200}
              alt="Welcome"
              className="h-full object-cover"
            />
          </div>
        </div>
      </div> */} -->
<!-- 
      {/* Daily Goal & Insights */}
      {/* <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gray-900 rounded-lg p-6 flex flex-col shadow-lg col-span-1 ">
          <h2 className="text-xl font-bold mb-2">Daily Goal</h2>
          <div className="flex-1 flex flex-col items-center justify-center">
            <ProgressRing
              progress={callProgress}
              size={120}
              strokeWidth={12}
              text="15/25"
              textClassName="text-xl font-bold"
            />
            <p className="text-success text-sm mt-2">calls completed</p>
          </div>
        </div>

        <div className="bg-gray-900 flex flex-row rounded-lg p-6 shadow-lg col-span-full">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <h2 className="text-xl font-bold">Insights Box</h2>
              <TrendingUp className="w-6 h-6 text-yellow-400" />
            </div>
            <div className="border-l-4 border-yellow-400 pl-2 mb-4">
              <h3 className="text-lg font-bold">Motivational Insights</h3>
              <p className="text-sm">
                "You're only 5 calls away from reaching today's goal—keep
                going!"
              </p>
            </div>
          </div>

          <div className="mt-auto">
            <Image
              src="/placeholder.svg?height=100&width=150"
              width={150}
              height={100}
              alt="Motivational"
              className="ml-auto"
            />
          </div>
        </div>
      </div> */}
      {/* </div>  */}

      {/* Deals Stats */}
      {/* <div className="bg-gray-900 rounded-lg p-6 shadow-lg">
          <h2 className="text-gray-500 uppercase font-bold mb-2">DEALS</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <div className="text-4xl font-bold">235</div>
              <div className="text-sm text-gray-400">Total</div>
              <div className="text-lime font-bold">25.75%</div>
            </div>
            <div>
              <div className="text-4xl font-bold">185</div>
              <div className="text-sm text-gray-400">Closed</div>
              <div className="h-2 mt-2 bg-blue-900 rounded-full"></div>
            </div>
            <div>
              <div className="text-4xl font-bold">20</div>
              <div className="text-sm text-gray-400">In progress</div>
              <div className="h-2 mt-2 bg-red-900 rounded-full"></div>
            </div>
          </div>
          <Progress
            value={dealsProgress}
            className="h-2 mt-4 bg-lime/25"
            indicatorClassName="bg-lime"
          />
        </div> */}

      {/* Action Buttons */}
      {/* <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Button className="lime-button">
            <Phone className="mr-2 h-5 w-5" />
            Call Next Customer
          </Button>
          <Button className="lime-button">
            <MessageSquareText className="mr-2 h-5 w-5" />
            Review AI Feedback
          </Button>
          <Button className="lime-button">
            <Clock className="mr-2 h-5 w-5" />
            History
          </Button>
        </div> */}

      {/* Call Logging */}
      {/* <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-gray-800 rounded-lg p-6 shadow-lg">
            <h2 className="text-2xl font-bold mb-4">Call logging</h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left text-gray-400">
                    <th className="pb-2">Name</th>
                    <th className="pb-2">Phone</th>
                    <th className="pb-2">Notes</th>
                    <th className="pb-2">Status</th>
                  </tr>
                </thead>
                <tbody>
                  <CallLogRow
                    name="Alex Johnson"
                    phone="(555)-123-4567"
                    notes="Interested in product demo; prefers afternoon calls."
                    available={true}
                  />
                  <CallLogRow
                    name="Rachel Green"
                    phone="(555)-888-1234"
                    notes="Interested in a demo; prefers morning calls."
                    available={false}
                  />
                  <CallLogRow
                    name="Monica Geller"
                    phone="(555)-777-4567"
                    notes="Requested a pricing breakdown."
                    available={false}
                  />
                  <CallLogRow
                    name="Chandler Bing"
                    phone="(555)-333-6789"
                    notes="Needs help with product configuration."
                    available={true}
                  />
                </tbody>
              </table>
            </div>
          </div>

          {/* Performance Chart */}
      {/* <div className="performance-card">
        <div className="p-4 border-b border-blue-900">
          <h2 className="text-xl font-bold">Performance Tracker</h2>
        </div>
        <div className="p-4">
          <PerformanceChart />
        </div>
      </div> */}
      {/* </div>  */}

      {/* Team Highlights & Leaderboard */}
      {/* <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <TeamHighlights />
          <LeaderboardHighlights />
        </div> */}
      {/* </div> */}

      {/* ajskdjasjkjskldjjklsadjljklasjkldsjklsdjklasddjklsdjklasdjkljklsdkjdajklsdjklasdjlasdjklasdjklsdjkla  */} -->