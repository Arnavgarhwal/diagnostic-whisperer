// Disease Information Data
export const diseases = [
  {
    id: 1,
    name: "Type 2 Diabetes",
    category: "Metabolic",
    description: "A chronic condition affecting how the body processes blood sugar (glucose).",
    symptoms: ["Increased thirst", "Frequent urination", "Blurred vision", "Fatigue", "Slow-healing sores"],
    treatments: ["Lifestyle changes", "Oral medications", "Insulin therapy", "Blood sugar monitoring"],
    prevention: ["Maintain healthy weight", "Regular exercise", "Balanced diet", "Regular checkups"],
    severity: "Chronic",
    image: "🩺"
  },
  {
    id: 2,
    name: "Hypertension",
    category: "Cardiovascular",
    description: "High blood pressure that can lead to serious health problems if untreated.",
    symptoms: ["Headaches", "Shortness of breath", "Nosebleeds", "Dizziness", "Chest pain"],
    treatments: ["ACE inhibitors", "Beta-blockers", "Diuretics", "Lifestyle modifications"],
    prevention: ["Reduce sodium intake", "Regular exercise", "Limit alcohol", "Manage stress"],
    severity: "Chronic",
    image: "❤️"
  },
  {
    id: 3,
    name: "Asthma",
    category: "Respiratory",
    description: "A condition in which airways narrow and swell, producing extra mucus.",
    symptoms: ["Wheezing", "Coughing", "Chest tightness", "Shortness of breath", "Trouble sleeping"],
    treatments: ["Inhaled corticosteroids", "Bronchodilators", "Allergy medications", "Immunotherapy"],
    prevention: ["Identify triggers", "Air quality monitoring", "Regular medication", "Flu vaccination"],
    severity: "Chronic",
    image: "🫁"
  },
  {
    id: 4,
    name: "Migraine",
    category: "Neurological",
    description: "A headache of varying intensity, often with nausea and sensitivity to light.",
    symptoms: ["Throbbing pain", "Nausea", "Light sensitivity", "Aura", "Vomiting"],
    treatments: ["Pain relievers", "Triptans", "Anti-nausea drugs", "Preventive medications"],
    prevention: ["Regular sleep", "Stay hydrated", "Stress management", "Avoid triggers"],
    severity: "Episodic",
    image: "🧠"
  },
  {
    id: 5,
    name: "Arthritis",
    category: "Musculoskeletal",
    description: "Inflammation of one or more joints, causing pain and stiffness.",
    symptoms: ["Joint pain", "Stiffness", "Swelling", "Reduced motion", "Redness"],
    treatments: ["Anti-inflammatory drugs", "Physical therapy", "Surgery", "Joint injections"],
    prevention: ["Maintain weight", "Regular exercise", "Protect joints", "Balanced diet"],
    severity: "Chronic",
    image: "🦴"
  },
  {
    id: 6,
    name: "Anxiety Disorder",
    category: "Mental Health",
    description: "A mental health disorder characterized by excessive worry and fear.",
    symptoms: ["Nervousness", "Rapid heartbeat", "Sweating", "Trembling", "Fatigue"],
    treatments: ["Psychotherapy", "Medications", "Relaxation techniques", "Support groups"],
    prevention: ["Regular exercise", "Adequate sleep", "Limit caffeine", "Social support"],
    severity: "Chronic",
    image: "🧘"
  },
  {
    id: 7,
    name: "Common Cold",
    category: "Infectious",
    description: "A viral infection of the upper respiratory tract.",
    symptoms: ["Runny nose", "Sore throat", "Cough", "Congestion", "Sneezing"],
    treatments: ["Rest", "Fluids", "Over-the-counter meds", "Throat lozenges"],
    prevention: ["Hand washing", "Avoid close contact", "Boost immunity", "Stay warm"],
    severity: "Acute",
    image: "🤧"
  },
  {
    id: 8,
    name: "Gastritis",
    category: "Digestive",
    description: "Inflammation of the stomach lining causing digestive issues.",
    symptoms: ["Stomach pain", "Nausea", "Bloating", "Indigestion", "Loss of appetite"],
    treatments: ["Antacids", "H2 blockers", "Proton pump inhibitors", "Antibiotics"],
    prevention: ["Limit alcohol", "Avoid spicy foods", "Manage stress", "Eat regularly"],
    severity: "Acute/Chronic",
    image: "🫃"
  }
];

export const categories = ["All", "Metabolic", "Cardiovascular", "Respiratory", "Neurological", "Musculoskeletal", "Mental Health", "Infectious", "Digestive"];

// Medicine Data
export const medicines = [
  {
    id: 1,
    name: "Paracetamol 500mg",
    category: "Pain Relief",
    price: 5.99,
    description: "For relief of mild to moderate pain and fever",
    dosage: "1-2 tablets every 4-6 hours",
    inStock: true,
    prescription: false,
    image: "💊"
  },
  {
    id: 2,
    name: "Amoxicillin 250mg",
    category: "Antibiotics",
    price: 12.99,
    description: "Antibiotic for bacterial infections",
    dosage: "As directed by physician",
    inStock: true,
    prescription: true,
    image: "💉"
  },
  {
    id: 3,
    name: "Omeprazole 20mg",
    category: "Digestive",
    price: 8.49,
    description: "For acid reflux and heartburn",
    dosage: "1 capsule daily before breakfast",
    inStock: true,
    prescription: false,
    image: "🔵"
  },
  {
    id: 4,
    name: "Cetirizine 10mg",
    category: "Allergy",
    price: 6.99,
    description: "Antihistamine for allergies",
    dosage: "1 tablet daily",
    inStock: true,
    prescription: false,
    image: "🟡"
  },
  {
    id: 5,
    name: "Metformin 500mg",
    category: "Diabetes",
    price: 15.99,
    description: "For type 2 diabetes management",
    dosage: "As directed by physician",
    inStock: true,
    prescription: true,
    image: "🟢"
  },
  {
    id: 6,
    name: "Ibuprofen 400mg",
    category: "Pain Relief",
    price: 7.49,
    description: "Anti-inflammatory pain reliever",
    dosage: "1 tablet every 6-8 hours",
    inStock: false,
    prescription: false,
    image: "🔴"
  },
  {
    id: 7,
    name: "Vitamin D3 1000IU",
    category: "Vitamins",
    price: 9.99,
    description: "Daily vitamin D supplement",
    dosage: "1 capsule daily with food",
    inStock: true,
    prescription: false,
    image: "☀️"
  },
  {
    id: 8,
    name: "Atorvastatin 10mg",
    category: "Cardiovascular",
    price: 18.99,
    description: "For cholesterol management",
    dosage: "1 tablet daily",
    inStock: true,
    prescription: true,
    image: "❤️"
  }
];

export const medicineCategories = ["All", "Pain Relief", "Antibiotics", "Digestive", "Allergy", "Diabetes", "Vitamins", "Cardiovascular"];

// Diagnostic Tests Data
export const diagnosticTests = [
  {
    id: 1,
    name: "Complete Blood Count (CBC)",
    category: "Blood Tests",
    price: 25.00,
    description: "Measures different components of blood including RBC, WBC, and platelets",
    turnaround: "24 hours",
    homeCollection: true,
    fasting: false,
    image: "🩸"
  },
  {
    id: 2,
    name: "Lipid Profile",
    category: "Blood Tests",
    price: 35.00,
    description: "Measures cholesterol and triglyceride levels",
    turnaround: "24 hours",
    homeCollection: true,
    fasting: true,
    image: "💧"
  },
  {
    id: 3,
    name: "Thyroid Function Test",
    category: "Hormone Tests",
    price: 45.00,
    description: "Evaluates thyroid gland function",
    turnaround: "48 hours",
    homeCollection: true,
    fasting: false,
    image: "🦋"
  },
  {
    id: 4,
    name: "Chest X-Ray",
    category: "Imaging",
    price: 60.00,
    description: "Imaging of chest, lungs, and heart",
    turnaround: "Same day",
    homeCollection: false,
    fasting: false,
    image: "📷"
  },
  {
    id: 5,
    name: "MRI Brain",
    category: "Imaging",
    price: 350.00,
    description: "Detailed imaging of brain structures",
    turnaround: "2-3 days",
    homeCollection: false,
    fasting: false,
    image: "🧲"
  },
  {
    id: 6,
    name: "Blood Glucose Fasting",
    category: "Blood Tests",
    price: 15.00,
    description: "Measures blood sugar after fasting",
    turnaround: "Same day",
    homeCollection: true,
    fasting: true,
    image: "🍬"
  },
  {
    id: 7,
    name: "Kidney Function Test",
    category: "Blood Tests",
    price: 40.00,
    description: "Evaluates kidney health and function",
    turnaround: "24 hours",
    homeCollection: true,
    fasting: false,
    image: "🫘"
  },
  {
    id: 8,
    name: "CT Scan Abdomen",
    category: "Imaging",
    price: 250.00,
    description: "Cross-sectional imaging of abdominal organs",
    turnaround: "1-2 days",
    homeCollection: false,
    fasting: true,
    image: "🔬"
  },
  {
    id: 9,
    name: "Vitamin D Test",
    category: "Vitamin Tests",
    price: 30.00,
    description: "Measures vitamin D levels in blood",
    turnaround: "24 hours",
    homeCollection: true,
    fasting: false,
    image: "☀️"
  },
  {
    id: 10,
    name: "ECG/EKG",
    category: "Cardiac Tests",
    price: 50.00,
    description: "Records electrical activity of the heart",
    turnaround: "Same day",
    homeCollection: false,
    fasting: false,
    image: "💓"
  }
];

export const testCategories = ["All", "Blood Tests", "Hormone Tests", "Imaging", "Vitamin Tests", "Cardiac Tests"];

// Doctor Data
export const doctors = [
  {
    id: 1,
    name: "Dr. Sarah Johnson",
    specialty: "Cardiology",
    experience: 15,
    rating: 4.9,
    reviews: 234,
    education: "MD, Harvard Medical School",
    languages: ["English", "Spanish"],
    consultationFee: 150,
    nextAvailable: "Today",
    image: "👩‍⚕️",
    about: "Specializing in preventive cardiology and heart disease management with 15 years of experience."
  },
  {
    id: 2,
    name: "Dr. Michael Chen",
    specialty: "General Medicine",
    experience: 12,
    rating: 4.8,
    reviews: 189,
    education: "MD, Johns Hopkins University",
    languages: ["English", "Mandarin"],
    consultationFee: 100,
    nextAvailable: "Today",
    image: "👨‍⚕️",
    about: "Comprehensive primary care with focus on preventive medicine and chronic disease management."
  },
  {
    id: 3,
    name: "Dr. Emily Williams",
    specialty: "Dermatology",
    experience: 10,
    rating: 4.7,
    reviews: 156,
    education: "MD, Stanford University",
    languages: ["English"],
    consultationFee: 120,
    nextAvailable: "Tomorrow",
    image: "👩‍⚕️",
    about: "Expert in medical and cosmetic dermatology, treating various skin conditions."
  },
  {
    id: 4,
    name: "Dr. James Wilson",
    specialty: "Orthopedics",
    experience: 18,
    rating: 4.9,
    reviews: 312,
    education: "MD, Yale School of Medicine",
    languages: ["English", "French"],
    consultationFee: 175,
    nextAvailable: "Today",
    image: "👨‍⚕️",
    about: "Specialized in sports medicine and joint replacement surgery."
  },
  {
    id: 5,
    name: "Dr. Priya Sharma",
    specialty: "Pediatrics",
    experience: 8,
    rating: 4.8,
    reviews: 145,
    education: "MD, Columbia University",
    languages: ["English", "Hindi"],
    consultationFee: 90,
    nextAvailable: "Today",
    image: "👩‍⚕️",
    about: "Dedicated to providing comprehensive healthcare for children and adolescents."
  },
  {
    id: 6,
    name: "Dr. Robert Davis",
    specialty: "Neurology",
    experience: 20,
    rating: 4.9,
    reviews: 278,
    education: "MD, Mayo Clinic",
    languages: ["English"],
    consultationFee: 200,
    nextAvailable: "In 2 days",
    image: "👨‍⚕️",
    about: "Expert in treating neurological disorders including migraines, epilepsy, and movement disorders."
  },
  {
    id: 7,
    name: "Dr. Lisa Anderson",
    specialty: "Psychiatry",
    experience: 14,
    rating: 4.7,
    reviews: 198,
    education: "MD, UCLA",
    languages: ["English", "Spanish"],
    consultationFee: 180,
    nextAvailable: "Tomorrow",
    image: "👩‍⚕️",
    about: "Specializing in anxiety, depression, and mood disorders with a holistic approach."
  },
  {
    id: 8,
    name: "Dr. Ahmed Hassan",
    specialty: "Gastroenterology",
    experience: 11,
    rating: 4.8,
    reviews: 167,
    education: "MD, Duke University",
    languages: ["English", "Arabic"],
    consultationFee: 140,
    nextAvailable: "Today",
    image: "👨‍⚕️",
    about: "Expert in digestive system disorders and liver diseases."
  }
];

export const specialties = ["All", "Cardiology", "General Medicine", "Dermatology", "Orthopedics", "Pediatrics", "Neurology", "Psychiatry", "Gastroenterology"];

// Time Slots
export const timeSlots = [
  "09:00 AM", "09:30 AM", "10:00 AM", "10:30 AM", "11:00 AM", "11:30 AM",
  "02:00 PM", "02:30 PM", "03:00 PM", "03:30 PM", "04:00 PM", "04:30 PM",
  "05:00 PM", "05:30 PM", "06:00 PM"
];

// AI Symptom Analyzer Responses
export const symptomResponses: Record<string, { condition: string; severity: string; advice: string; shouldSeeDoctor: boolean }> = {
  headache: {
    condition: "Possible tension headache or migraine",
    severity: "Low to Moderate",
    advice: "Rest in a quiet, dark room. Stay hydrated and consider over-the-counter pain relief. If headaches persist for more than 3 days or are severe, consult a doctor.",
    shouldSeeDoctor: false
  },
  fever: {
    condition: "Possible viral or bacterial infection",
    severity: "Moderate",
    advice: "Monitor temperature regularly. Rest and stay hydrated. Take fever-reducing medication if needed. Seek medical attention if fever exceeds 103°F (39.4°C) or lasts more than 3 days.",
    shouldSeeDoctor: true
  },
  cough: {
    condition: "Possible respiratory infection or allergies",
    severity: "Low to Moderate",
    advice: "Stay hydrated, use honey for soothing, and consider over-the-counter cough medication. If cough persists for more than 2 weeks or produces blood, see a doctor immediately.",
    shouldSeeDoctor: false
  },
  "chest pain": {
    condition: "Requires immediate medical attention",
    severity: "High",
    advice: "Chest pain can indicate serious conditions. If accompanied by shortness of breath, arm pain, or sweating, seek emergency medical care immediately.",
    shouldSeeDoctor: true
  },
  fatigue: {
    condition: "Possible causes include stress, poor sleep, or underlying conditions",
    severity: "Low to Moderate",
    advice: "Ensure adequate sleep (7-9 hours), maintain balanced nutrition, and manage stress. If fatigue persists for more than 2 weeks despite lifestyle changes, consult a doctor.",
    shouldSeeDoctor: false
  },
  nausea: {
    condition: "Possible digestive issues or viral infection",
    severity: "Low to Moderate",
    advice: "Eat small, bland meals. Stay hydrated with clear fluids. Avoid strong odors. If nausea persists for more than 48 hours or is accompanied by severe abdominal pain, seek medical care.",
    shouldSeeDoctor: false
  },
  "stomach pain": {
    condition: "Possible digestive issues, gastritis, or other conditions",
    severity: "Moderate",
    advice: "Avoid spicy and fatty foods. Eat smaller meals. If pain is severe, persistent, or accompanied by fever or vomiting, consult a doctor.",
    shouldSeeDoctor: true
  },
  dizziness: {
    condition: "Possible causes include dehydration, low blood pressure, or inner ear issues",
    severity: "Moderate",
    advice: "Sit or lie down immediately. Stay hydrated. Avoid sudden movements. If dizziness is frequent or accompanied by fainting, seek medical evaluation.",
    shouldSeeDoctor: true
  }
};

// Blog Posts Data
export const blogCategories = ["Wellness", "Nutrition", "Mental Health", "Fitness", "Medical News", "Prevention"];

export const blogPosts = [
  {
    id: 1,
    title: "10 Science-Backed Ways to Boost Your Immune System",
    excerpt: "Discover proven strategies to strengthen your body's natural defenses and stay healthy year-round.",
    content: `Your immune system is your body's first line of defense against illness. Here are science-backed ways to keep it functioning optimally:

1. Get Adequate Sleep
Sleep is when your body repairs and regenerates. Aim for 7-9 hours per night. Studies show that people who sleep less than 6 hours are more likely to catch a cold.

2. Eat a Balanced Diet
Focus on whole foods rich in vitamins C, D, and zinc. Include colorful fruits and vegetables, lean proteins, and healthy fats.

3. Exercise Regularly
Moderate exercise enhances immune function. Aim for 150 minutes of moderate activity per week.

4. Manage Stress
Chronic stress suppresses immune function. Practice meditation, yoga, or deep breathing exercises.

5. Stay Hydrated
Water helps carry oxygen to cells and removes toxins. Aim for 8 glasses daily.

6. Limit Alcohol
Excessive alcohol weakens the immune system. Stick to moderate consumption.

7. Don't Smoke
Smoking damages immune cells and increases infection risk.

8. Maintain a Healthy Weight
Obesity can impair immune function. Work towards a BMI within healthy range.

9. Get Vaccinated
Vaccines train your immune system to fight specific pathogens.

10. Practice Good Hygiene
Regular handwashing prevents the spread of germs.`,
    category: "Wellness",
    author: "Dr. Sarah Johnson",
    date: "January 15, 2024",
    readTime: "8 min read",
    image: "🛡️",
    tags: ["immunity", "health tips", "prevention"],
    featured: true
  },
  {
    id: 2,
    title: "Understanding Anxiety: Symptoms, Causes, and Treatment Options",
    excerpt: "A comprehensive guide to recognizing anxiety disorders and finding effective treatments.",
    content: `Anxiety is one of the most common mental health conditions, affecting millions worldwide. Understanding it is the first step to managing it effectively.

What is Anxiety?
Anxiety is your body's natural response to stress. It becomes a disorder when it interferes with daily life.

Common Symptoms:
- Persistent worry or fear
- Restlessness or feeling on edge
- Difficulty concentrating
- Sleep problems
- Physical symptoms like rapid heartbeat

Types of Anxiety Disorders:
1. Generalized Anxiety Disorder (GAD)
2. Panic Disorder
3. Social Anxiety Disorder
4. Specific Phobias

Treatment Options:
- Cognitive Behavioral Therapy (CBT)
- Medication (SSRIs, benzodiazepines)
- Lifestyle changes
- Relaxation techniques
- Support groups

When to Seek Help:
If anxiety is affecting your work, relationships, or quality of life, consult a mental health professional.`,
    category: "Mental Health",
    author: "Dr. Emily Chen",
    date: "January 12, 2024",
    readTime: "10 min read",
    image: "🧠",
    tags: ["mental health", "anxiety", "therapy"],
    featured: false
  },
  {
    id: 3,
    title: "The Mediterranean Diet: A Heart-Healthy Eating Plan",
    excerpt: "Learn why the Mediterranean diet is considered one of the healthiest eating patterns in the world.",
    content: `The Mediterranean diet has been extensively studied and shown to reduce the risk of heart disease, diabetes, and cognitive decline.

Key Components:
- Olive oil as the primary fat source
- Abundant fruits and vegetables
- Whole grains and legumes
- Fish and seafood twice weekly
- Moderate consumption of poultry and dairy
- Limited red meat

Health Benefits:
1. Reduced cardiovascular disease risk
2. Better blood sugar control
3. Improved brain health
4. Weight management
5. Reduced inflammation

Getting Started:
- Replace butter with olive oil
- Eat more fish, less red meat
- Include vegetables at every meal
- Choose whole grains
- Enjoy meals with family and friends

Sample Day:
Breakfast: Greek yogurt with berries and nuts
Lunch: Grilled chicken salad with olive oil dressing
Dinner: Baked salmon with roasted vegetables`,
    category: "Nutrition",
    author: "Dr. Maria Santos",
    date: "January 10, 2024",
    readTime: "7 min read",
    image: "🥗",
    tags: ["diet", "heart health", "nutrition"],
    featured: false
  },
  {
    id: 4,
    title: "Home Workouts: Building Strength Without a Gym",
    excerpt: "Effective bodyweight exercises you can do anywhere to build muscle and improve fitness.",
    content: `You don't need expensive equipment or a gym membership to get fit. Bodyweight exercises can be incredibly effective.

Essential Exercises:
1. Push-ups (chest, shoulders, triceps)
2. Squats (legs, glutes)
3. Planks (core)
4. Lunges (legs, balance)
5. Burpees (full body cardio)

Sample Workout:
Warm-up: 5 minutes jumping jacks
3 rounds of:
- 15 push-ups
- 20 squats
- 30-second plank
- 10 lunges each leg
- 10 burpees
Cool-down: Stretching

Tips for Success:
- Be consistent (aim for 3-4 times per week)
- Progress gradually
- Focus on proper form
- Stay hydrated
- Get adequate rest between workouts`,
    category: "Fitness",
    author: "Coach Mike Thompson",
    date: "January 8, 2024",
    readTime: "6 min read",
    image: "💪",
    tags: ["exercise", "home workout", "fitness"],
    featured: false
  },
  {
    id: 5,
    title: "Breakthrough in Cancer Research: New Treatment Shows Promise",
    excerpt: "Recent clinical trials reveal exciting developments in targeted cancer therapy.",
    content: `A new class of targeted therapies is showing remarkable results in treating previously difficult-to-treat cancers.

The Research:
Scientists have developed drugs that specifically target cancer cells while sparing healthy tissue, reducing side effects.

Key Findings:
- 60% response rate in advanced cases
- Significantly fewer side effects than chemotherapy
- Improved quality of life during treatment
- Potential for combination with existing therapies

What This Means:
This research represents a significant step forward in personalized medicine, where treatments are tailored to individual patients based on their genetic profile.

Current Status:
Phase 3 clinical trials are underway, with potential FDA approval expected within 2-3 years.`,
    category: "Medical News",
    author: "Dr. Robert Kim",
    date: "January 5, 2024",
    readTime: "5 min read",
    image: "🔬",
    tags: ["cancer", "research", "treatment"],
    featured: false
  },
  {
    id: 6,
    title: "Preventive Health Screenings: What You Need and When",
    excerpt: "A comprehensive guide to recommended health screenings by age and risk factors.",
    content: `Regular health screenings can detect problems early when they're most treatable.

Screenings by Age:

Ages 18-39:
- Blood pressure (every 2 years)
- Cholesterol (every 4-6 years)
- Skin exam (annually)
- Dental checkup (twice yearly)

Ages 40-49:
- All above screenings
- Diabetes screening (every 3 years)
- Eye exam (every 2-4 years)
- Women: Mammogram (annually)

Ages 50-64:
- Colonoscopy (every 10 years)
- Bone density scan (women)
- Prostate screening (men, discuss with doctor)

65+:
- Annual wellness visits
- Pneumonia vaccine
- Shingles vaccine
- Hearing and vision tests

Risk-Based Screenings:
Additional screenings may be needed based on family history, lifestyle, and other risk factors.`,
    category: "Prevention",
    author: "Dr. Lisa Wong",
    date: "January 3, 2024",
    readTime: "9 min read",
    image: "📋",
    tags: ["screening", "prevention", "health checkup"],
    featured: false
  },
  {
    id: 7,
    title: "Sleep Hygiene: Simple Habits for Better Rest",
    excerpt: "Transform your sleep quality with these evidence-based strategies for better rest.",
    content: `Quality sleep is essential for physical and mental health. Here's how to improve your sleep naturally.

The Science of Sleep:
Adults need 7-9 hours of quality sleep. Poor sleep is linked to obesity, heart disease, and cognitive decline.

Sleep Hygiene Tips:
1. Maintain a consistent schedule
2. Create a restful environment (cool, dark, quiet)
3. Limit screen time before bed
4. Avoid caffeine after 2 PM
5. Exercise regularly (but not close to bedtime)
6. Limit alcohol and large meals before bed

Relaxation Techniques:
- Progressive muscle relaxation
- Deep breathing exercises
- Meditation or mindfulness
- Reading (not on screens)

When to See a Doctor:
Consult a healthcare provider if you experience persistent insomnia, loud snoring, or daytime sleepiness.`,
    category: "Wellness",
    author: "Dr. James Miller",
    date: "January 1, 2024",
    readTime: "7 min read",
    image: "😴",
    tags: ["sleep", "wellness", "habits"],
    featured: false
  },
  {
    id: 8,
    title: "Managing Diabetes: Lifestyle Changes That Make a Difference",
    excerpt: "Practical strategies for controlling blood sugar through diet, exercise, and lifestyle modifications.",
    content: `Living well with diabetes is possible with the right approach to lifestyle management.

Understanding Blood Sugar:
Blood glucose levels are affected by food, activity, stress, and medication. Monitoring helps you understand patterns.

Dietary Strategies:
- Count carbohydrates
- Choose low glycemic index foods
- Include fiber-rich foods
- Control portion sizes
- Stay hydrated

Exercise Benefits:
Regular physical activity:
- Improves insulin sensitivity
- Helps maintain healthy weight
- Reduces stress
- Improves cardiovascular health

Monitoring:
- Check blood sugar regularly
- Keep a log of readings
- Note what affects your levels
- Share data with your healthcare team

Medication Adherence:
Take medications as prescribed and communicate with your doctor about any concerns.`,
    category: "Prevention",
    author: "Dr. Patricia Brown",
    date: "December 28, 2023",
    readTime: "8 min read",
    image: "🩺",
    tags: ["diabetes", "lifestyle", "blood sugar"],
    featured: false
  }
];
