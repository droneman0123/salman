import React, { useState } from 'react';
import { supabase } from '../services/supabaseClient';

function OtpVerification() {
  const [otp, setOtp] = useState('');
  const [verificationStatus, setVerificationStatus] = useState(null);

  const handleVerifyOtp = async (event) => {
    event.preventDefault();
    setVerificationStatus(null);

    try {
      // Assuming we have a function to verify OTP against the latest order for the user
      // This is a simplified example, you might need to adjust the query based on your actual logic
      const { data, error } = await supabase
        .from('orders')
        .select('otp')
        .order('id', { ascending: false })
        .limit(1)
        .single();
        
      if (error) {
        console.error('Error verifying OTP:', error);
        setVerificationStatus({ success: false, message: 'Error verifying OTP. Please try again.' });
      } else if (data?.otp === parseInt(otp)) {
        setVerificationStatus({ success: true, message: 'OTP Verified Successfully!' });
      } else {
        setVerificationStatus({ success: false, message: 'Invalid OTP. Please try again.' });
      }
    } catch (error) {
      console.error('Error verifying OTP:', error.message);
      setVerificationStatus({ success: false, message: 'Error verifying OTP. Please try again.' });
    }
  };

  return (
    <div>
      <h2>Verify OTP</h2>
      <form onSubmit={handleVerifyOtp}>
        <div>
          <label htmlFor="otp">Enter OTP:</label>
          <input
            type="text"
            id="otp"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            required
          />
        </div>
        <button type="submit">Verify OTP</button>
      </form>
      {verificationStatus && (
        <div style={{ marginTop: '10px', color: verificationStatus.success ? 'green' : 'red' }}>
          {verificationStatus.message}
        </div>
      )}
    </div>
  );
}

export default OtpVerification;