import React, { useState, useEffect } from 'react';
import s from './AddStudents.module.css';
import { IoSchool, IoRocketSharp, IoConstructOutline, IoNotifications } from 'react-icons/io5';

const AddStudents = () => {
  const [animateCount, setAnimateCount] = useState(0);
  const [showNotification, setShowNotification] = useState(false);
  
  // Animation effect for the countdown
  useEffect(() => {
    const timer = setInterval(() => {
      setAnimateCount(prev => (prev + 1) % 100);
    }, 3000);
    
    return () => clearInterval(timer);
  }, []);
  
  // Show notification effect
  useEffect(() => {
    setTimeout(() => {
      setShowNotification(true);
    }, 1500);
    
    const hideTimer = setTimeout(() => {
      setShowNotification(false);
    }, 6000);
    
    return () => clearTimeout(hideTimer);
  }, []);

  return (
    <div className={s.comingSoonContainer}>
      <div className={s.contentBox}>
        <div className={s.iconContainer}>
          <IoRocketSharp className={s.rocketIcon} />
          <div className={s.rocketTrail}></div>
        </div>
        
        <h1 className={s.title}>
          <span className={s.titlePart}>Student Registration</span>
          <span className={s.titleHighlight}>Coming Soon</span>
        </h1>
        
        <p className={s.description}>
          We're working hard to bring you an amazing new way to add and manage students.
          The feature will be available soon with bulk import, smart validation, and automatic notifications.
        </p>
        
        <div className={s.featuresGrid}>
          <div className={s.featureItem}>
            <div className={s.featureIcon}>
              <IoSchool />
            </div>
            <div className={s.featureDetails}>
              <h3>Bulk Registration</h3>
              <p>Add hundreds of students at once via Excel or CSV</p>
            </div>
          </div>
          
          <div className={s.featureItem}>
            <div className={s.featureIcon}>
              <IoConstructOutline />
            </div>
            <div className={s.featureDetails}>
              <h3>Smart Validation</h3>
              <p>Automatically validate student information</p>
            </div>
          </div>
          
          <div className={s.featureItem}>
            <div className={s.featureIcon}>
              <IoNotifications />
            </div>
            <div className={s.featureDetails}>
              <h3>Auto Notifications</h3>
              <p>Welcome messages sent automatically to new students</p>
            </div>
          </div>
        </div>
        
        <div className={s.progressContainer}>
          <div className={s.progressBar}>
            <div 
              className={s.progressFill} 
              style={{ width: `${75}%` }}
            ></div>
          </div>
          <p className={s.progressText}>Development Progress: 75% Complete</p>
        </div>
        
        <div className={s.countdownSection}>
          <div className={s.countdownItem}>
            <div className={s.countdownNumber}>{14}</div>
            <div className={s.countdownLabel}>Days</div>
          </div>
          <div className={s.countdownItem}>
            <div className={s.countdownNumber}>{8}</div>
            <div className={s.countdownLabel}>Hours</div>
          </div>
          <div className={s.countdownItem}>
            <div className={s.countdownNumber}>{32}</div>
            <div className={s.countdownLabel}>Minutes</div>
          </div>
          <div className={s.countdownItem}>
            <div className={s.countdownNumber} key={animateCount}>{45}</div>
            <div className={s.countdownLabel}>Seconds</div>
          </div>
        </div>
        
        <div className={s.subscribeSection}>
          <p>Want to be notified when it's ready?</p>
          <div className={s.subscribeForm}>
            <input type="email" placeholder="Enter your email" className={s.emailInput} />
            <button className={s.notifyButton}>Notify Me</button>
          </div>
        </div>
      </div>
      
      {showNotification && (
        <div className={s.notification}>
          <IoRocketSharp className={s.notificationIcon} />
          <div className={s.notificationContent}>
            <h4>Get Ready for Launch!</h4>
            <p>Our team is putting final touches on this feature.</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddStudents;