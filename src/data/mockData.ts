export const mockDoctors = [
  {
    id: 'd1',
    name: 'Dr. Shruti Sharma',
    specialization: 'Clinical Psychologist',
    experience: '8 Years Exp.',
    price: '₹1200 / session',
    city: 'Mumbai',
    rating: 4.9,
    image: 'https://i.pravatar.cc/150?u=a042581f4e29026704d',
  },
  {
    id: 'd2',
    name: 'Dr. Arjun Mehta',
    specialization: 'Psychiatrist',
    experience: '12 Years Exp.',
    price: '₹1500 / session',
    city: 'Delhi',
    rating: 4.8,
    image: 'https://i.pravatar.cc/150?u=a042581f4e29026024d',
  },
  {
    id: 'd3',
    name: 'Aisha Khan',
    specialization: 'Counseling Psychologist',
    experience: '5 Years Exp.',
    price: '₹900 / session',
    city: 'Bangalore',
    rating: 4.7,
    image: 'https://i.pravatar.cc/150?u=a04258a2462d826712d',
  },
  {
    id: 'd4',
    name: 'Dr. Vikram Desai',
    specialization: 'Couples Therapist',
    experience: '10 Years Exp.',
    price: '₹1800 / session',
    city: 'Pune',
    rating: 4.9,
    image: 'https://i.pravatar.cc/150?u=a042581f4e29026704e',
  },
];

export const mockAppointments = [
  {
    id: 'a1',
    doctorName: 'Dr. Shruti Sharma',
    date: 'Tomorrow',
    time: '4:00 PM',
    type: 'Video Consultation',
  }
];

export const mockResources = [
  {
    id: 'r1',
    title: '5 Techniques to Manage Daily Anxiety',
    type: 'Article',
    category: 'Anxiety',
    readTime: '4 min read',
    image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&q=80&w=400',
    saved: true,
  },
  {
    id: 'r2',
    title: 'Guided Sleep Meditation for Deep Rest',
    type: 'Video',
    category: 'Sleep',
    readTime: '12 min',
    image: 'https://images.unsplash.com/photo-1511295742362-92c96b5ade36?auto=format&fit=crop&q=80&w=400',
    saved: false,
  },
  {
    id: 'r3',
    title: 'Understanding Family Dynamics',
    type: 'Article',
    category: 'Family',
    readTime: '7 min read',
    image: 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&q=80&w=400',
    saved: true,
  },
  {
    id: 'r4',
    title: 'Breathwork for Instant Calm',
    type: 'Video',
    category: 'Anxiety',
    readTime: '5 min',
    image: 'https://images.unsplash.com/photo-1499209974431-9dddcece7f88?auto=format&fit=crop&q=80&w=400',
    saved: false,
  }
];

export const mockResourceCategories = ['All', 'Anxiety', 'Sleep', 'Family', 'Stress'];

export const mockAssessmentBuckets = [
  { id: 'b1', title: 'Individual Therapy', icon: 'person-outline', color: '#E8F0ED' },
  { id: 'b2', title: 'Couples Counseling', icon: 'people-outline', color: '#F3E5DC' },
  { id: 'b3', title: 'Career Stress', icon: 'briefcase-outline', color: '#E8F0ED' },
  { id: 'b4', title: 'Teen/Adolescent', icon: 'school-outline', color: '#F3E5DC' },
];

export const mockAssessmentQuestions = [
  {
    id: 'q1',
    text: 'Over the last 2 weeks, how often have you felt down, depressed, or hopeless?',
    options: ['Not at all', 'Several days', 'More than half the days', 'Nearly every day']
  },
  {
    id: 'q2',
    text: 'How often have you felt little interest or pleasure in doing things?',
    options: ['Not at all', 'Several days', 'More than half the days', 'Nearly every day']
  },
  {
    id: 'q3',
    text: 'How would you rate your sleep quality recently?',
    options: ['Very good', 'Fair', 'Poor', 'Very poor']
  }
];
