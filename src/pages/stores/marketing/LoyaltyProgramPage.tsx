import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MdArrowBack, MdAdd, MdEdit, MdDelete, MdStar, MdLocalOffer, MdPeople, MdBarChart } from 'react-icons/md';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const LoyaltyProgramPage = () => {
  const navigate = useNavigate();
  
  // Mock data for demonstration
  const [rules, setRules] = useState([
    {
      id: 1,
      name: 'Basic Purchase',
      description: 'Points earned per dollar spent',
      pointsPerDollar: 1,
      minPurchase: 0,
      enabled: true
    },
    {
      id: 2,
      name: 'Service Bonus',
      description: 'Extra points for specific services',
      pointsPerDollar: 2,
      minPurchase: 0,
      enabled: true
    },
    {
      id: 3,
      name: 'Birthday Bonus',
      description: 'Double points during birthday month',
      pointsPerDollar: 2,
      minPurchase: 0,
      enabled: true
    }
  ]);

  const [rewards, setRewards] = useState([
    {
      id: 1,
      name: '10% Discount',
      description: '10% off your next order',
      pointsRequired: 100,
      type: 'discount',
      value: 10,
      enabled: true
    },
    {
      id: 2,
      name: 'Free Service',
      description: 'Free basic service',
      pointsRequired: 200,
      type: 'free_service',
      value: 0,
      enabled: true
    },
    {
      id: 3,
      name: 'VIP Treatment',
      description: 'Priority service and special offers',
      pointsRequired: 500,
      type: 'vip',
      value: 0,
      enabled: true
    }
  ]);

  const [customerStatus, setCustomerStatus] = useState([
    {
      id: 1,
      name: 'Bronze',
      minPoints: 0,
      maxPoints: 100,
      benefits: ['Basic rewards', 'Email updates'],
      customerCount: 150
    },
    {
      id: 2,
      name: 'Silver',
      minPoints: 101,
      maxPoints: 500,
      benefits: ['Priority service', 'Birthday bonus', 'Special offers'],
      customerCount: 75
    },
    {
      id: 3,
      name: 'Gold',
      minPoints: 501,
      maxPoints: 1000,
      benefits: ['VIP treatment', 'Free services', 'Personal concierge'],
      customerCount: 25
    }
  ]);

  const [redemptions, setRedemptions] = useState([
    {
      id: 1,
      customerName: 'John Doe',
      rewardName: '10% Discount',
      pointsUsed: 100,
      date: '2024-03-15',
      status: 'completed'
    },
    {
      id: 2,
      customerName: 'Jane Smith',
      rewardName: 'Free Service',
      pointsUsed: 200,
      date: '2024-03-14',
      status: 'pending'
    }
  ]);

  const [analytics, setAnalytics] = useState([
    { month: 'Jan', pointsEarned: 1200, pointsRedeemed: 800, newMembers: 25 },
    { month: 'Feb', pointsEarned: 1500, pointsRedeemed: 900, newMembers: 30 },
    { month: 'Mar', pointsEarned: 1800, pointsRedeemed: 1200, newMembers: 35 }
  ]);

  const handleBackToMarketing = () => {
    navigate('/stores/marketing');
  };

  const handleToggleRule = (id: number) => {
    setRules(rules.map(rule => 
      rule.id === id ? { ...rule, enabled: !rule.enabled } : rule
    ));
  };

  const handleToggleReward = (id: number) => {
    setRewards(rewards.map(reward => 
      reward.id === id ? { ...reward, enabled: !reward.enabled } : reward
    ));
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center">
          <button 
            onClick={handleBackToMarketing}
            className="mr-4 p-2 rounded-full hover:bg-gray-200 transition duration-200"
          >
            <MdArrowBack className="text-gray-600" size={24} />
          </button>
          <div>
            <h1 className="text-2xl font-semibold">Loyalty Program</h1>
            <p className="text-sm text-gray-600 mt-1">
              Manage your customer loyalty program
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Points Rules */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">Points Rules</CardTitle>
            <Button size="sm">
              <MdAdd className="mr-2" size={16} />
              Add Rule
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {rules.map((rule) => (
                <div key={rule.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <h3 className="font-medium">{rule.name}</h3>
                    <p className="text-sm text-gray-600">{rule.description}</p>
                    <p className="text-sm text-gray-600 mt-1">
                      {rule.pointsPerDollar} points per dollar
                    </p>
                  </div>
                  <Switch
                    checked={rule.enabled}
                    onCheckedChange={() => handleToggleRule(rule.id)}
                  />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Rewards */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">Rewards</CardTitle>
            <Button size="sm">
              <MdAdd className="mr-2" size={16} />
              Add Reward
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {rewards.map((reward) => (
                <div key={reward.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <h3 className="font-medium">{reward.name}</h3>
                    <p className="text-sm text-gray-600">{reward.description}</p>
                    <p className="text-sm text-gray-600 mt-1">
                      {reward.pointsRequired} points required
                    </p>
                  </div>
                  <Switch
                    checked={reward.enabled}
                    onCheckedChange={() => handleToggleReward(reward.id)}
                  />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Customer Status Levels */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Status Levels</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {customerStatus.map((status) => (
                <div key={status.id} className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium">{status.name}</h3>
                      <p className="text-sm text-gray-600">
                        {status.minPoints} - {status.maxPoints} points
                      </p>
                    </div>
                    <span className="text-sm font-medium">
                      {status.customerCount} customers
                    </span>
                  </div>
                  <div className="mt-2">
                    <p className="text-sm font-medium text-gray-700">Benefits:</p>
                    <ul className="list-disc list-inside text-sm text-gray-600">
                      {status.benefits.map((benefit, index) => (
                        <li key={index}>{benefit}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Redemptions */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Recent Redemptions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {redemptions.map((redemption) => (
                <div key={redemption.id} className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium">{redemption.customerName}</h3>
                      <p className="text-sm text-gray-600">{redemption.rewardName}</p>
                    </div>
                    <span className={`text-sm font-medium ${
                      redemption.status === 'completed' ? 'text-green-600' : 'text-yellow-600'
                    }`}>
                      {redemption.status}
                    </span>
                  </div>
                  <div className="mt-2 flex justify-between text-sm text-gray-600">
                    <span>{redemption.date}</span>
                    <span>{redemption.pointsUsed} points</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Analytics */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-lg">Program Analytics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={analytics}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="pointsEarned" fill="#8884d8" name="Points Earned" />
                <Bar dataKey="pointsRedeemed" fill="#82ca9d" name="Points Redeemed" />
                <Bar dataKey="newMembers" fill="#ffc658" name="New Members" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoyaltyProgramPage; 