// Extended Symptom Responses Database
export const symptomResponses: Record<string, { condition: string; severity: string; advice: string; shouldSeeDoctor: boolean }> = {
  // Original symptoms
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
  },
  // Extended symptoms
  "back pain": {
    condition: "Possible muscle strain, disc issues, or spinal problems",
    severity: "Low to Moderate",
    advice: "Apply ice or heat, maintain good posture, gentle stretching. If pain radiates to legs or is accompanied by numbness, see a doctor.",
    shouldSeeDoctor: false
  },
  "joint pain": {
    condition: "Possible arthritis, injury, or inflammation",
    severity: "Low to Moderate",
    advice: "Rest the affected joint, apply ice, take anti-inflammatory medication. If swelling persists or joint is hot to touch, consult a doctor.",
    shouldSeeDoctor: false
  },
  "shortness of breath": {
    condition: "Possible respiratory or cardiac issues",
    severity: "Moderate to High",
    advice: "Sit upright and try to relax. If severe or sudden, especially with chest pain, seek immediate medical attention.",
    shouldSeeDoctor: true
  },
  "sore throat": {
    condition: "Possible viral infection or strep throat",
    severity: "Low",
    advice: "Gargle with warm salt water, stay hydrated, use throat lozenges. If fever or white patches appear, see a doctor for strep test.",
    shouldSeeDoctor: false
  },
  "runny nose": {
    condition: "Possible cold, allergies, or sinus infection",
    severity: "Low",
    advice: "Use saline nasal spray, stay hydrated, rest. If symptoms persist over 10 days or worsen, consult a doctor.",
    shouldSeeDoctor: false
  },
  congestion: {
    condition: "Possible cold, flu, or allergies",
    severity: "Low",
    advice: "Use decongestants, steam inhalation, saline rinse. If accompanied by facial pain or green discharge, see a doctor.",
    shouldSeeDoctor: false
  },
  sneezing: {
    condition: "Possible allergies or cold",
    severity: "Low",
    advice: "Identify and avoid triggers, use antihistamines. If persistent or accompanied by other symptoms, consult a doctor.",
    shouldSeeDoctor: false
  },
  "body aches": {
    condition: "Possible viral infection or flu",
    severity: "Low to Moderate",
    advice: "Rest, stay hydrated, take pain relievers. If accompanied by high fever or rash, seek medical attention.",
    shouldSeeDoctor: false
  },
  chills: {
    condition: "Possible fever or infection",
    severity: "Moderate",
    advice: "Monitor temperature, stay warm, rest. If accompanied by high fever, consult a doctor.",
    shouldSeeDoctor: true
  },
  "weight loss": {
    condition: "Unexplained weight loss may indicate various conditions",
    severity: "Moderate",
    advice: "If unintentional weight loss of more than 5% in 6-12 months, consult a doctor for evaluation.",
    shouldSeeDoctor: true
  },
  "weight gain": {
    condition: "Possible thyroid issues, hormonal imbalance, or lifestyle factors",
    severity: "Low to Moderate",
    advice: "Review diet and activity levels. If sudden or accompanied by fatigue or hair loss, see a doctor.",
    shouldSeeDoctor: false
  },
  insomnia: {
    condition: "Possible stress, anxiety, or sleep disorders",
    severity: "Low to Moderate",
    advice: "Maintain sleep hygiene, limit screen time, avoid caffeine. If persistent over 3 weeks, consult a doctor.",
    shouldSeeDoctor: false
  },
  anxiety: {
    condition: "Anxiety disorder or stress response",
    severity: "Low to Moderate",
    advice: "Practice relaxation techniques, exercise regularly. If affecting daily life, consider therapy or medical consultation.",
    shouldSeeDoctor: true
  },
  depression: {
    condition: "Possible mood disorder",
    severity: "Moderate to High",
    advice: "Reach out to a mental health professional. Exercise, maintain social connections. Seek immediate help if having thoughts of self-harm.",
    shouldSeeDoctor: true
  },
  "memory problems": {
    condition: "Possible stress, sleep issues, or neurological conditions",
    severity: "Moderate",
    advice: "Ensure adequate sleep, reduce stress. If significant or progressive, consult a neurologist.",
    shouldSeeDoctor: true
  },
  confusion: {
    condition: "Possible dehydration, infection, or neurological issues",
    severity: "Moderate to High",
    advice: "If sudden or severe, seek immediate medical attention. May indicate serious underlying condition.",
    shouldSeeDoctor: true
  },
  "vision changes": {
    condition: "Possible eye conditions or other health issues",
    severity: "Moderate",
    advice: "If sudden vision loss, flashes, or floaters, see an eye doctor immediately. Schedule routine eye exam for gradual changes.",
    shouldSeeDoctor: true
  },
  "blurred vision": {
    condition: "Possible refractive error, diabetes, or eye disease",
    severity: "Moderate",
    advice: "Schedule an eye exam. If sudden onset, seek immediate care.",
    shouldSeeDoctor: true
  },
  "ear pain": {
    condition: "Possible ear infection or wax buildup",
    severity: "Low to Moderate",
    advice: "Apply warm compress, take pain relievers. If accompanied by fever or drainage, see a doctor.",
    shouldSeeDoctor: false
  },
  "hearing loss": {
    condition: "Possible ear wax, infection, or nerve damage",
    severity: "Moderate",
    advice: "Avoid inserting objects in ear. Schedule hearing test. If sudden, seek immediate care.",
    shouldSeeDoctor: true
  },
  ringing: {
    condition: "Possible tinnitus from noise exposure or underlying condition",
    severity: "Low to Moderate",
    advice: "Avoid loud noises, manage stress. If persistent, consult an ENT specialist.",
    shouldSeeDoctor: false
  },
  "skin rash": {
    condition: "Possible allergic reaction, infection, or skin condition",
    severity: "Low to Moderate",
    advice: "Keep area clean and dry, avoid scratching. If spreading, blistering, or accompanied by fever, see a doctor.",
    shouldSeeDoctor: false
  },
  itching: {
    condition: "Possible allergies, dry skin, or skin conditions",
    severity: "Low",
    advice: "Moisturize, use mild soaps, take antihistamines. If severe or persistent, consult a dermatologist.",
    shouldSeeDoctor: false
  },
  swelling: {
    condition: "Possible injury, infection, or fluid retention",
    severity: "Low to Moderate",
    advice: "Elevate affected area, apply ice. If sudden, painful, or affecting breathing, seek immediate care.",
    shouldSeeDoctor: true
  },
  bruising: {
    condition: "Possible injury or blood clotting issues",
    severity: "Low",
    advice: "Apply ice, monitor healing. If occurring without injury or frequently, consult a doctor.",
    shouldSeeDoctor: false
  },
  bleeding: {
    condition: "Requires attention based on source and severity",
    severity: "Moderate to High",
    advice: "Apply pressure to wounds. Seek immediate care for uncontrolled bleeding or internal bleeding signs.",
    shouldSeeDoctor: true
  },
  "abdominal pain": {
    condition: "Possible digestive issues, appendicitis, or other conditions",
    severity: "Moderate",
    advice: "Note location and characteristics. If severe, persistent, or accompanied by fever, seek medical care.",
    shouldSeeDoctor: true
  },
  bloating: {
    condition: "Possible digestive issues or food intolerance",
    severity: "Low",
    advice: "Eat slowly, avoid trigger foods, take probiotics. If persistent or severe, consult a doctor.",
    shouldSeeDoctor: false
  },
  constipation: {
    condition: "Possible dietary issues or digestive problems",
    severity: "Low",
    advice: "Increase fiber and water intake, exercise. If lasting over 3 weeks, consult a doctor.",
    shouldSeeDoctor: false
  },
  diarrhea: {
    condition: "Possible infection, food intolerance, or digestive issues",
    severity: "Low to Moderate",
    advice: "Stay hydrated, eat bland foods. If bloody, lasting over 2 days, or accompanied by high fever, see a doctor.",
    shouldSeeDoctor: false
  },
  vomiting: {
    condition: "Possible infection, food poisoning, or other causes",
    severity: "Moderate",
    advice: "Stay hydrated with small sips, rest. If blood in vomit or lasting over 24 hours, seek medical care.",
    shouldSeeDoctor: true
  },
  heartburn: {
    condition: "Possible acid reflux or GERD",
    severity: "Low",
    advice: "Avoid trigger foods, don't lie down after eating, take antacids. If frequent, consult a doctor.",
    shouldSeeDoctor: false
  },
  palpitations: {
    condition: "Possible arrhythmia, anxiety, or caffeine effects",
    severity: "Moderate",
    advice: "Note frequency and triggers. If accompanied by chest pain or fainting, seek immediate care.",
    shouldSeeDoctor: true
  },
  "leg cramps": {
    condition: "Possible dehydration, mineral deficiency, or circulation issues",
    severity: "Low",
    advice: "Stretch, massage, stay hydrated. If frequent or severe, consult a doctor.",
    shouldSeeDoctor: false
  },
  numbness: {
    condition: "Possible nerve compression or circulation issues",
    severity: "Moderate",
    advice: "Change position, stretch. If persistent or affecting one side of body, seek immediate care.",
    shouldSeeDoctor: true
  },
  tingling: {
    condition: "Possible nerve issues or circulation problems",
    severity: "Low to Moderate",
    advice: "Note when it occurs and location. If persistent, consult a doctor.",
    shouldSeeDoctor: false
  },
  weakness: {
    condition: "Possible fatigue, dehydration, or underlying conditions",
    severity: "Low to Moderate",
    advice: "Rest, eat balanced meals, stay hydrated. If sudden or affecting one side, seek immediate care.",
    shouldSeeDoctor: true
  },
  "hair loss": {
    condition: "Possible stress, hormonal changes, or medical conditions",
    severity: "Low",
    advice: "Maintain healthy diet, manage stress. If sudden or patchy, consult a dermatologist.",
    shouldSeeDoctor: false
  },
  "frequent urination": {
    condition: "Possible UTI, diabetes, or prostate issues",
    severity: "Low to Moderate",
    advice: "Monitor fluid intake. If accompanied by pain or blood, see a doctor.",
    shouldSeeDoctor: true
  },
  "painful urination": {
    condition: "Possible UTI or STI",
    severity: "Moderate",
    advice: "Increase water intake, see a doctor for proper diagnosis and treatment.",
    shouldSeeDoctor: true
  },
  "blood in urine": {
    condition: "Possible kidney stones, infection, or other urological issues",
    severity: "Moderate to High",
    advice: "Seek medical attention promptly for evaluation and testing.",
    shouldSeeDoctor: true
  },
  "difficulty breathing": {
    condition: "Possible asthma, COPD, or cardiac issues",
    severity: "High",
    advice: "Use prescribed inhalers if available. If severe or sudden, call emergency services.",
    shouldSeeDoctor: true
  },
  wheezing: {
    condition: "Possible asthma, allergies, or respiratory infection",
    severity: "Moderate",
    advice: "Use inhaler if prescribed, stay calm. If severe, seek medical care.",
    shouldSeeDoctor: true
  },
  "loss of appetite": {
    condition: "Possible infection, stress, or underlying condition",
    severity: "Low to Moderate",
    advice: "Eat small, frequent meals. If lasting over 2 weeks with weight loss, consult a doctor.",
    shouldSeeDoctor: false
  },
  thirst: {
    condition: "Possible dehydration or diabetes",
    severity: "Low to Moderate",
    advice: "Increase fluid intake. If excessive and persistent, check blood sugar levels.",
    shouldSeeDoctor: true
  },
  sweating: {
    condition: "Possible fever, anxiety, or hormonal changes",
    severity: "Low",
    advice: "Stay cool, wear breathable clothing. If excessive without cause, consult a doctor.",
    shouldSeeDoctor: false
  },
  "night sweats": {
    condition: "Possible infection, hormonal changes, or other conditions",
    severity: "Moderate",
    advice: "Note frequency and associated symptoms. If persistent, see a doctor.",
    shouldSeeDoctor: true
  },
  "cold hands": {
    condition: "Possible circulation issues or Raynaud's phenomenon",
    severity: "Low",
    advice: "Keep hands warm, avoid cold exposure. If color changes or pain, consult a doctor.",
    shouldSeeDoctor: false
  },
  "hot flashes": {
    condition: "Possible menopause or hormonal changes",
    severity: "Low",
    advice: "Dress in layers, avoid triggers. If severe, discuss options with doctor.",
    shouldSeeDoctor: false
  },
  tremors: {
    condition: "Possible essential tremor, medication side effect, or neurological condition",
    severity: "Moderate",
    advice: "Note when occurring and triggers. Consult a neurologist for evaluation.",
    shouldSeeDoctor: true
  },
  seizures: {
    condition: "Requires immediate medical attention",
    severity: "High",
    advice: "Call emergency services. Keep person safe during seizure, do not restrain.",
    shouldSeeDoctor: true
  },
  fainting: {
    condition: "Possible low blood pressure, cardiac, or other issues",
    severity: "Moderate to High",
    advice: "Lie down, elevate legs. If recurring or with injury, seek medical evaluation.",
    shouldSeeDoctor: true
  },
  "mood swings": {
    condition: "Possible hormonal changes or mental health conditions",
    severity: "Low to Moderate",
    advice: "Track patterns, maintain routine. If affecting daily life, consult a mental health professional.",
    shouldSeeDoctor: false
  },
  irritability: {
    condition: "Possible stress, sleep deprivation, or hormonal changes",
    severity: "Low",
    advice: "Ensure adequate sleep, manage stress. If persistent, consider talking to a therapist.",
    shouldSeeDoctor: false
  },
  "difficulty concentrating": {
    condition: "Possible ADHD, stress, or sleep issues",
    severity: "Low to Moderate",
    advice: "Improve sleep, reduce distractions. If affecting work or school, seek evaluation.",
    shouldSeeDoctor: false
  },
  "muscle pain": {
    condition: "Possible strain, overuse, or viral infection",
    severity: "Low",
    advice: "Rest, apply heat or ice, gentle stretching. If severe or persistent, consult a doctor.",
    shouldSeeDoctor: false
  },
  stiffness: {
    condition: "Possible arthritis, muscle tension, or inactivity",
    severity: "Low",
    advice: "Stretch regularly, stay active, apply warmth. If persistent, see a doctor.",
    shouldSeeDoctor: false
  },
  "jaw pain": {
    condition: "Possible TMJ disorder or dental issues",
    severity: "Low to Moderate",
    advice: "Avoid hard foods, apply warm compress. If severe, see dentist or doctor.",
    shouldSeeDoctor: false
  },
  "tooth pain": {
    condition: "Possible cavity, infection, or dental issue",
    severity: "Moderate",
    advice: "Rinse with salt water, take pain relievers. See dentist as soon as possible.",
    shouldSeeDoctor: true
  },
  "bad breath": {
    condition: "Possible dental issues, dry mouth, or digestive problems",
    severity: "Low",
    advice: "Maintain oral hygiene, stay hydrated. If persistent, see dentist or doctor.",
    shouldSeeDoctor: false
  },
  "dry mouth": {
    condition: "Possible medication side effect or dehydration",
    severity: "Low",
    advice: "Increase water intake, use saliva substitutes. If persistent, review medications with doctor.",
    shouldSeeDoctor: false
  },
  hiccups: {
    condition: "Usually harmless, may indicate digestive irritation",
    severity: "Low",
    advice: "Hold breath, drink water slowly. If lasting over 48 hours, see a doctor.",
    shouldSeeDoctor: false
  },
  snoring: {
    condition: "Possible sleep apnea or nasal obstruction",
    severity: "Low to Moderate",
    advice: "Sleep on side, maintain healthy weight. If accompanied by gasping, see a sleep specialist.",
    shouldSeeDoctor: false
  },
  hoarseness: {
    condition: "Possible laryngitis or vocal strain",
    severity: "Low",
    advice: "Rest voice, stay hydrated. If lasting over 2 weeks, see an ENT specialist.",
    shouldSeeDoctor: false
  },
  "difficulty swallowing": {
    condition: "Possible GERD, infection, or esophageal issues",
    severity: "Moderate",
    advice: "Eat slowly, chew thoroughly. If painful or persistent, seek medical evaluation.",
    shouldSeeDoctor: true
  },
  "lump in throat": {
    condition: "Possible globus sensation from stress or GERD",
    severity: "Low to Moderate",
    advice: "Manage stress, treat acid reflux. If persistent or with pain, see a doctor.",
    shouldSeeDoctor: false
  }
};

export const commonSymptoms = [
  "Headache", "Fever", "Cough", "Fatigue", "Nausea", "Dizziness", "Stomach Pain", "Chest Pain",
  "Back Pain", "Joint Pain", "Shortness of Breath", "Sore Throat", "Runny Nose", "Congestion",
  "Body Aches", "Chills", "Skin Rash", "Itching", "Swelling", "Numbness", "Weakness",
  "Anxiety", "Depression", "Insomnia", "Memory Problems", "Vision Changes", "Ear Pain",
  "Abdominal Pain", "Bloating", "Constipation", "Diarrhea", "Heartburn", "Palpitations"
];
