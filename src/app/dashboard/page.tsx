"use client";

import { useEffect, useState } from 'react';
import SleepChart from '@/components/SleepChart';
import RestingHeartRateChart from '@/components/RestingHeartRateChart';
import DateTimePicker from '@/components/DateTimePicker';

const getInitialSleepStartDate = () => {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  yesterday.setHours(22, 30, 0, 0);
  return yesterday;
};

const getInitialSleepEndDate = () => {
  const today = new Date();
  today.setHours(8, 0, 0, 0);
  return today;
};

const getInitialHeartRateStartDate = () => {
  const date = new Date();
  date.setDate(date.getDate() - 7);
  return date;
};

const getInitialHeartRateEndDate = () => {
  return new Date();
};

export default function Dashboard() {
  const [sleepData, setSleepData] = useState(null);
  const [restingHeartRateData, setRestingHeartRateData] = useState(null);
  const [isSleepLoading, setIsSleepLoading] = useState(true);
  const [isHeartRateLoading, setIsHeartRateLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sleepStartDate, setSleepStartDate] = useState(getInitialSleepStartDate());
  const [sleepEndDate, setSleepEndDate] = useState(getInitialSleepEndDate());
  const [heartRateStartDate, setHeartRateStartDate] = useState(getInitialHeartRateStartDate());
  const [heartRateEndDate, setHeartRateEndDate] = useState(getInitialHeartRateEndDate());

  const fetchSleepData = async () => {
    setIsSleepLoading(true);
    setError(null);
    try {
      const sleepResponse = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/api/v1/sleep-data?start_datetime=${sleepStartDate.toISOString()}&end_datetime=${sleepEndDate.toISOString()}`,
        { credentials: 'include' }
      );
  
      if (!sleepResponse.ok) {
        throw new Error('Failed to fetch sleep data');
      }
  
      const sleepData = await sleepResponse.json();
      setSleepData(sleepData);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unknown error occurred");
      }
    } finally {
      setIsSleepLoading(false);
    }
  };

  const fetchHeartRateData = async () => {
    setIsHeartRateLoading(true);
    setError(null);
    try {
      const heartRateResponse = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/api/v1/resting-heart-rate?start_date=${heartRateStartDate.toISOString().split('T')[0]}&end_date=${heartRateEndDate.toISOString().split('T')[0]}`,
        { credentials: 'include' }
      );
  
      if (!heartRateResponse.ok) {
        throw new Error('Failed to fetch resting heart rate data');
      }
  
      const heartRateData = await heartRateResponse.json();
      setRestingHeartRateData(heartRateData);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unknown error occurred");
      }
    } finally {
      setIsHeartRateLoading(false);
    }
  };

  useEffect(() => {
    const checkAuthAndFetch = async () => {
      try {
        const authResponse = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_API_URL}/api/v1/auth-status`, { credentials: 'include' });
        if (!authResponse.ok || !(await authResponse.json()).isAuthenticated) {
          window.location.href = '/';
          return;
        }
        fetchSleepData();
        fetchHeartRateData();
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("An unknown error occurred");
        }
      }
    };
    checkAuthAndFetch();
  }, []);

  if (error) {
    return <main className="flex min-h-screen flex-col items-center justify-center p-24"><p>Error: {error}</p></main>;
  }

  return (
    <main className="flex min-h-screen flex-col items-center p-24">
      <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-400 to-purple-400 bg-clip-text text-transparent mb-8">
        Your Sleep Data
      </h1>
      <a href="/" className="mb-10 text-blue-500 hover:underline">Back to Home</a>

      <div className="flex flex-col sm:flex-row gap-4 items-center justify-center mb-10">
        <div className="flex flex-col flex-shrink-0 w-53">
          <DateTimePicker
            label="Start Date"
            selected={sleepStartDate}
            onChange={(date) => date && setSleepStartDate(date)}
          />
        </div>
        <div className="flex flex-col flex-shrink-0 w-53">
          <DateTimePicker
            label="End Date"
            selected={sleepEndDate}
            onChange={(date) => date && setSleepEndDate(date)}
          />
        </div>
        <button
          onClick={fetchSleepData}
          className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-6 py-2 rounded-lg font-semibold transition-all mt-6"
        >
          Go
        </button>
      </div>
      
      <div className="w-full max-w-6xl">
        {isSleepLoading ? <p>Loading sleep data...</p> : sleepData ? <SleepChart data={sleepData} /> : <p>No sleep data to display.</p>}
      </div>

      <div className="w-full max-w-6xl mt-10">
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-center mb-10">
          <div className="flex flex-col flex-shrink-0 w-53">
            <DateTimePicker
              label="Start Date"
              selected={heartRateStartDate}
              onChange={(date) => date && setHeartRateStartDate(date)}
              showTimeSelect={false}
            />
          </div>
          <div className="flex flex-col flex-shrink-0 w-53">
            <DateTimePicker
              label="End Date"
              selected={heartRateEndDate}
              onChange={(date) => date && setHeartRateEndDate(date)}
              showTimeSelect={false}
            />
          </div>
          <button
            onClick={fetchHeartRateData}
            className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-6 py-2 rounded-lg font-semibold transition-all mt-6"
          >
            Go
          </button>
        </div>
        {isHeartRateLoading ? <p>Loading resting heart rate data...</p> : restingHeartRateData ? <RestingHeartRateChart data={restingHeartRateData} /> : <p>No resting heart rate data to display.</p>}
      </div>
    </main>
  );
}