import React, { useState } from 'react';
import { FaFileDownload, FaFilter, FaStar, FaChartLine, FaComments, FaThumbsUp, FaThumbsDown } from 'react-icons/fa';

const CustomerSatisfactionReportPage = () => {
  const [showFilters, setShowFilters] = useState(false);
  const [timeFrame, setTimeFrame] = useState('month');
  const [storeFilter, setStoreFilter] = useState('all');
  const [serviceFilter, setServiceFilter] = useState('all');

  // Mock customer satisfaction data
  const satisfactionData = {
    overallRating: 4.7,
    previousRating: 4.5,
    totalReviews: 342,
    reviewsByRating: {
      5: 210,
      4: 80,
      3: 32,
      2: 15,
      1: 5
    },
    serviceRatings: {
      lavagem: 4.8,
      passadoria: 4.6,
      tingimento: 4.5,
      costura: 4.7,
      limpezaEspecial: 4.9
    },
    metrics: {
      nps: 78,
      previousNps: 72,
      responseRate: 0.85,
      recommendationRate: 0.92
    },
    monthlyRatings: [
      { month: 'Jan', rating: 4.5 },
      { month: 'Feb', rating: 4.5 },
      { month: 'Mar', rating: 4.6 },
      { month: 'Apr', rating: 4.6 },
      { month: 'May', rating: 4.7 },
      { month: 'Jun', rating: 4.7 }
    ],
    recentFeedback: [
      {
        id: 1,
        customer: 'Ana Silva',
        rating: 5,
        comment: 'Serviço excelente, minhas roupas voltaram impecáveis!',
        date: '2023-06-15',
        service: 'lavagem',
        helpful: 12
      },
      {
        id: 2,
        customer: 'Carlos Mendes',
        rating: 4,
        comment: 'Boa qualidade, mas o prazo de entrega foi um pouco maior que o esperado.',
        date: '2023-06-14',
        service: 'tingimento',
        helpful: 8
      },
      {
        id: 3,
        customer: 'Patricia Almeida',
        rating: 5,
        comment: 'Atendimento excelente e serviço de primeira qualidade!',
        date: '2023-06-12',
        service: 'limpezaEspecial',
        helpful: 15
      },
      {
        id: 4,
        customer: 'João Ferreira',
        rating: 3,
        comment: 'Serviço razoável, mas achei o preço um pouco alto para o resultado.',
        date: '2023-06-10',
        service: 'passadoria',
        helpful: 5
      },
      {
        id: 5,
        customer: 'Mariana Costa',
        rating: 5,
        comment: 'Muito bom! O conserto da minha roupa ficou perfeito.',
        date: '2023-06-08',
        service: 'costura',
        helpful: 10
      }
    ],
    mostCommonIssues: [
      { issue: 'Prazo de entrega', percentage: 42 },
      { issue: 'Preço', percentage: 28 },
      { issue: 'Qualidade do acabamento', percentage: 18 },
      { issue: 'Atendimento', percentage: 12 }
    ]
  };

  // Calculate metrics
  const ratingChange = satisfactionData.overallRating - satisfactionData.previousRating;
  const positiveReviews = satisfactionData.reviewsByRating[5] + satisfactionData.reviewsByRating[4];
  const positivePercentage = (positiveReviews / satisfactionData.totalReviews) * 100;
  const npsChange = satisfactionData.metrics.nps - satisfactionData.metrics.previousNps;

  // Service names in Portuguese
  const serviceNames = {
    lavagem: 'Lavagem',
    passadoria: 'Passadoria',
    tingimento: 'Tingimento',
    costura: 'Costura',
    limpezaEspecial: 'Limpeza Especial'
  };

  // Filter feedback based on service if needed
  const filteredFeedback = serviceFilter === 'all' 
    ? satisfactionData.recentFeedback 
    : satisfactionData.recentFeedback.filter(item => item.service === serviceFilter);

  // Function to render stars based on rating
  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    
    for (let i = 0; i < fullStars; i++) {
      stars.push(<FaStar key={`star-${i}`} className="text-yellow-400" />);
    }
    
    if (hasHalfStar) {
      stars.push(<FaStar key="half-star" className="text-yellow-200" />);
    }
    
    const emptyStars = 5 - stars.length;
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<FaStar key={`empty-${i}`} className="text-gray-200" />);
    }
    
    return stars;
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Customer Satisfaction Report</h1>
        <div className="flex gap-3">
          <button 
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg shadow-sm hover:bg-gray-50"
            onClick={() => setShowFilters(!showFilters)}
          >
            <FaFilter className="text-gray-600" />
            <span>Filters</span>
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg shadow-sm hover:bg-gray-50">
            <FaFileDownload className="text-gray-600" />
            <span>Export</span>
          </button>
        </div>
      </div>

      {showFilters && (
        <div className="bg-white p-4 rounded-lg shadow-sm mb-6 flex flex-wrap gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Time Frame</label>
            <select 
              className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={timeFrame}
              onChange={(e) => setTimeFrame(e.target.value)}
            >
              <option value="week">Last 7 days</option>
              <option value="month">Last 30 days</option>
              <option value="quarter">Last Quarter</option>
              <option value="year">Last Year</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Store</label>
            <select 
              className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={storeFilter}
              onChange={(e) => setStoreFilter(e.target.value)}
            >
              <option value="all">All Stores</option>
              <option value="store-1">Loja Centro</option>
              <option value="store-2">Loja Norte</option>
              <option value="store-3">Loja Sul</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Service</label>
            <select 
              className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={serviceFilter}
              onChange={(e) => setServiceFilter(e.target.value)}
            >
              <option value="all">All Services</option>
              <option value="lavagem">Lavagem</option>
              <option value="passadoria">Passadoria</option>
              <option value="tingimento">Tingimento</option>
              <option value="costura">Costura</option>
              <option value="limpezaEspecial">Limpeza Especial</option>
            </select>
          </div>
        </div>
      )}

      {/* Key Satisfaction Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <h3 className="text-lg font-medium mb-1 text-gray-600">Overall Rating</h3>
          <div className="flex items-center">
            <p className="text-3xl font-bold text-blue-600 mr-2">{satisfactionData.overallRating.toFixed(1)}</p>
            <div className="flex text-lg">
              {renderStars(satisfactionData.overallRating)}
            </div>
          </div>
          <div className="flex items-center mt-2 text-sm">
            <span className={`mr-1 ${ratingChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {ratingChange >= 0 ? '↑' : '↓'} {Math.abs(ratingChange).toFixed(1)}
            </span>
            <span className="text-gray-500">vs. previous period</span>
          </div>
        </div>
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <h3 className="text-lg font-medium mb-1 text-gray-600">Total Reviews</h3>
          <p className="text-3xl font-bold text-blue-600">{satisfactionData.totalReviews}</p>
          <div className="flex items-center mt-2 text-sm">
            <span className="mr-1 text-gray-600">From all services</span>
          </div>
        </div>
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <h3 className="text-lg font-medium mb-1 text-gray-600">Positive Reviews</h3>
          <p className="text-3xl font-bold text-green-600">{positivePercentage.toFixed(1)}%</p>
          <div className="flex items-center mt-2 text-sm">
            <span className="text-gray-500">{positiveReviews} reviews rated 4-5 stars</span>
          </div>
        </div>
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <h3 className="text-lg font-medium mb-1 text-gray-600">NPS Score</h3>
          <p className="text-3xl font-bold text-blue-600">{satisfactionData.metrics.nps}</p>
          <div className="flex items-center mt-2 text-sm">
            <span className={`mr-1 ${npsChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {npsChange >= 0 ? '↑' : '↓'} {Math.abs(npsChange)}
            </span>
            <span className="text-gray-500">vs. previous period</span>
          </div>
        </div>
      </div>

      {/* Ratings Distribution and Service Ratings */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <h2 className="text-xl font-semibold mb-4">Ratings Distribution</h2>
          <div className="space-y-3">
            {[5, 4, 3, 2, 1].map(rating => {
              const count = satisfactionData.reviewsByRating[rating as keyof typeof satisfactionData.reviewsByRating];
              const percentage = (count / satisfactionData.totalReviews) * 100;
              
              return (
                <div key={rating} className="flex items-center">
                  <div className="flex-shrink-0 w-16">
                    <div className="flex">
                      {rating} <FaStar className="ml-1 text-yellow-400" />
                    </div>
                  </div>
                  <div className="flex-grow mx-3">
                    <div className="h-4 bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className={`h-full ${rating >= 4 ? 'bg-green-500' : rating === 3 ? 'bg-yellow-500' : 'bg-red-500'}`}
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                  </div>
                  <div className="flex-shrink-0 w-16 text-right">
                    <span className="text-gray-600">{count}</span>
                    <span className="text-gray-400 ml-1">({percentage.toFixed(1)}%)</span>
                  </div>
                </div>
              );
            })}
          </div>
          
          <div className="mt-6">
            <h3 className="text-lg font-medium mb-3">Rating Trend</h3>
            <div className="h-40 flex items-center justify-center">
              {/* Placeholder for Rating Trend Chart */}
              <div className="text-center text-gray-500">
                <FaChartLine className="mx-auto text-4xl mb-2 text-blue-200" />
                <p>Monthly rating trend will be displayed here</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm">
          <h2 className="text-xl font-semibold mb-4">Service Ratings</h2>
          <div className="space-y-4">
            {Object.entries(satisfactionData.serviceRatings).map(([service, rating]) => (
              <div key={service} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <h3 className="font-medium">{serviceNames[service as keyof typeof serviceNames]}</h3>
                </div>
                <div className="flex items-center">
                  <span className="font-bold text-lg mr-2">{rating.toFixed(1)}</span>
                  <div className="flex">
                    {renderStars(rating)}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6">
            <h3 className="text-lg font-medium mb-3">Most Common Issues</h3>
            <div className="space-y-3">
              {satisfactionData.mostCommonIssues.map((issue, index) => (
                <div key={index} className="flex items-center">
                  <div className="flex-shrink-0 w-40">
                    <span className="text-gray-600">{issue.issue}</span>
                  </div>
                  <div className="flex-grow mx-3">
                    <div className="h-4 bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-orange-400"
                        style={{ width: `${issue.percentage}%` }}
                      ></div>
                    </div>
                  </div>
                  <div className="flex-shrink-0 w-12 text-right">
                    <span className="text-gray-600">{issue.percentage}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Additional Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <h2 className="text-xl font-semibold mb-4">Response Rate</h2>
          <div className="flex flex-col items-center">
            <div className="relative w-36 h-36">
              <svg className="w-full h-full" viewBox="0 0 36 36">
                <path
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="#E5E7EB"
                  strokeWidth="3"
                />
                <path
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="#3B82F6"
                  strokeWidth="3"
                  strokeDasharray={`${satisfactionData.metrics.responseRate * 100}, 100`}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
                <span className="text-3xl font-bold text-blue-600">{(satisfactionData.metrics.responseRate * 100).toFixed(0)}%</span>
              </div>
            </div>
            <p className="mt-4 text-gray-600 text-center">Percentage of customers who respond to satisfaction surveys</p>
          </div>
        </div>
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <h2 className="text-xl font-semibold mb-4">Recommendation Rate</h2>
          <div className="flex flex-col items-center">
            <div className="relative w-36 h-36">
              <svg className="w-full h-full" viewBox="0 0 36 36">
                <path
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="#E5E7EB"
                  strokeWidth="3"
                />
                <path
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="#10B981"
                  strokeWidth="3"
                  strokeDasharray={`${satisfactionData.metrics.recommendationRate * 100}, 100`}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
                <span className="text-3xl font-bold text-green-600">{(satisfactionData.metrics.recommendationRate * 100).toFixed(0)}%</span>
              </div>
            </div>
            <p className="mt-4 text-gray-600 text-center">Customers who would recommend our services to others</p>
          </div>
        </div>
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <h2 className="text-xl font-semibold mb-4">NPS Breakdown</h2>
          <div className="space-y-4">
            <div className="flex items-center p-3 bg-green-50 rounded-lg">
              <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center rounded-full bg-green-100 text-green-600">
                <FaThumbsUp className="text-xl" />
              </div>
              <div className="ml-4">
                <h3 className="font-medium text-green-800">Promoters</h3>
                <p className="text-green-600">82% of customers</p>
              </div>
            </div>
            <div className="flex items-center p-3 bg-yellow-50 rounded-lg">
              <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center rounded-full bg-yellow-100 text-yellow-600">
                <FaThumbsUp className="text-xl transform rotate-90" />
              </div>
              <div className="ml-4">
                <h3 className="font-medium text-yellow-800">Passives</h3>
                <p className="text-yellow-600">14% of customers</p>
              </div>
            </div>
            <div className="flex items-center p-3 bg-red-50 rounded-lg">
              <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center rounded-full bg-red-100 text-red-600">
                <FaThumbsDown className="text-xl" />
              </div>
              <div className="ml-4">
                <h3 className="font-medium text-red-800">Detractors</h3>
                <p className="text-red-600">4% of customers</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Feedback */}
      <div className="bg-white rounded-lg p-6 shadow-sm mb-6">
        <h2 className="text-xl font-semibold mb-4">Recent Customer Feedback</h2>
        <div className="space-y-4">
          {filteredFeedback.map((feedback) => (
            <div key={feedback.id} className="border border-gray-200 rounded-lg p-4">
              <div className="flex justify-between">
                <div>
                  <h3 className="font-medium">{feedback.customer}</h3>
                  <div className="flex items-center mt-1">
                    <div className="flex text-yellow-400">
                      {renderStars(feedback.rating)}
                    </div>
                    <span className="ml-2 text-sm text-gray-500">
                      {serviceNames[feedback.service as keyof typeof serviceNames]} • {new Date(feedback.date).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                <div className="flex items-center text-sm text-gray-500">
                  <FaThumbsUp className="text-gray-400 mr-1" />
                  <span>{feedback.helpful}</span>
                </div>
              </div>
              <p className="mt-3 text-gray-700">{feedback.comment}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Satisfaction by Month Chart */}
      <div className="bg-white rounded-lg p-6 shadow-sm">
        <h2 className="text-xl font-semibold mb-4">Satisfaction Trend</h2>
        <div className="h-80 flex items-center justify-center">
          {/* Placeholder for Satisfaction Trend Chart */}
          <div className="text-center text-gray-500">
            <FaChartLine className="mx-auto text-5xl mb-3 text-blue-200" />
            <p>Monthly satisfaction trend will be displayed here</p>
            <div className="mt-4 flex justify-center space-x-8">
              {satisfactionData.monthlyRatings.map((data, index) => (
                <div key={index} className="text-center">
                  <div className="font-medium">{data.month}</div>
                  <div className="text-blue-600 font-bold">{data.rating.toFixed(1)}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerSatisfactionReportPage; 