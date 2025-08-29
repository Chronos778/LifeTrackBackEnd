/**
 * Advanced Frontend Data Structures for Healthcare PHR System
 * Implements efficient data structures for better client-side performance
 */

// Hash Table implementation for fast doctor lookups
class DoctorHashTable {
  constructor() {
    this.buckets = new Array(50).fill(null).map(() => []);
    this.size = 0;
  }

  _hash(doctorId) {
    return doctorId % this.buckets.length;
  }

  set(doctorId, doctor) {
    const index = this._hash(doctorId);
    const bucket = this.buckets[index];
    
    // Check if doctor already exists
    const existingIndex = bucket.findIndex(item => item.key === doctorId);
    if (existingIndex !== -1) {
      bucket[existingIndex].value = doctor;
    } else {
      bucket.push({ key: doctorId, value: doctor });
      this.size++;
    }
  }

  get(doctorId) {
    const index = this._hash(doctorId);
    const bucket = this.buckets[index];
    const item = bucket.find(item => item.key === doctorId);
    return item ? item.value : null;
  }

  delete(doctorId) {
    const index = this._hash(doctorId);
    const bucket = this.buckets[index];
    const itemIndex = bucket.findIndex(item => item.key === doctorId);
    
    if (itemIndex !== -1) {
      bucket.splice(itemIndex, 1);
      this.size--;
      return true;
    }
    return false;
  }

  getAllDoctors() {
    const doctors = [];
    for (const bucket of this.buckets) {
      for (const item of bucket) {
        doctors.push(item.value);
      }
    }
    return doctors;
  }
}

// Trie data structure for fast medical term search
class MedicalTermsTrie {
  constructor() {
    this.root = {};
  }

  insert(word) {
    let node = this.root;
    for (const char of word.toLowerCase()) {
      if (!node[char]) {
        node[char] = {};
      }
      node = node[char];
    }
    node.isEndOfWord = true;
    node.fullWord = word;
  }

  search(prefix) {
    let node = this.root;
    for (const char of prefix.toLowerCase()) {
      if (!node[char]) {
        return [];
      }
      node = node[char];
    }
    
    const results = [];
    this._collectWords(node, results);
    return results.slice(0, 10); // Limit to 10 suggestions
  }

  _collectWords(node, results) {
    if (node.isEndOfWord) {
      results.push(node.fullWord);
    }
    
    for (const char in node) {
      if (char !== 'isEndOfWord' && char !== 'fullWord') {
        this._collectWords(node[char], results);
      }
    }
  }
}

// Priority Queue for treatment scheduling
class TreatmentPriorityQueue {
  constructor() {
    this.heap = [];
  }

  enqueue(treatment, priority) {
    const node = { treatment, priority };
    this.heap.push(node);
    this._heapifyUp(this.heap.length - 1);
  }

  dequeue() {
    if (this.heap.length === 0) return null;
    
    const min = this.heap[0];
    const end = this.heap.pop();
    
    if (this.heap.length > 0) {
      this.heap[0] = end;
      this._heapifyDown(0);
    }
    
    return min.treatment;
  }

  peek() {
    return this.heap.length > 0 ? this.heap[0].treatment : null;
  }

  _heapifyUp(index) {
    const parentIndex = Math.floor((index - 1) / 2);
    
    if (parentIndex >= 0 && this.heap[parentIndex].priority > this.heap[index].priority) {
      [this.heap[parentIndex], this.heap[index]] = [this.heap[index], this.heap[parentIndex]];
      this._heapifyUp(parentIndex);
    }
  }

  _heapifyDown(index) {
    const leftChild = 2 * index + 1;
    const rightChild = 2 * index + 2;
    let smallest = index;

    if (leftChild < this.heap.length && this.heap[leftChild].priority < this.heap[smallest].priority) {
      smallest = leftChild;
    }

    if (rightChild < this.heap.length && this.heap[rightChild].priority < this.heap[smallest].priority) {
      smallest = rightChild;
    }

    if (smallest !== index) {
      [this.heap[index], this.heap[smallest]] = [this.heap[smallest], this.heap[index]];
      this._heapifyDown(smallest);
    }
  }

  size() {
    return this.heap.length;
  }
}

// LRU Cache for API responses
class LRUCache {
  constructor(maxSize = 50) {
    this.maxSize = maxSize;
    this.cache = new Map();
  }

  get(key) {
    if (this.cache.has(key)) {
      // Move to end (most recently used)
      const value = this.cache.get(key);
      this.cache.delete(key);
      this.cache.set(key, value);
      return value;
    }
    return null;
  }

  set(key, value) {
    if (this.cache.has(key)) {
      this.cache.delete(key);
    } else if (this.cache.size >= this.maxSize) {
      // Remove least recently used (first item)
      const firstKey = this.cache.keys().next().value;
      this.cache.delete(firstKey);
    }
    
    this.cache.set(key, value);
  }

  clear() {
    this.cache.clear();
  }
}

// Binary Search Tree for organized health records
class HealthRecordBST {
  constructor() {
    this.root = null;
  }

  insert(record) {
    const node = {
      record,
      left: null,
      right: null
    };

    if (!this.root) {
      this.root = node;
      return;
    }

    this._insertNode(this.root, node);
  }

  _insertNode(root, newNode) {
    const rootDate = new Date(root.record.record_date);
    const newDate = new Date(newNode.record.record_date);

    if (newDate < rootDate) {
      if (!root.left) {
        root.left = newNode;
      } else {
        this._insertNode(root.left, newNode);
      }
    } else {
      if (!root.right) {
        root.right = newNode;
      } else {
        this._insertNode(root.right, newNode);
      }
    }
  }

  findRecordsInDateRange(startDate, endDate) {
    const results = [];
    this._inOrderSearch(this.root, startDate, endDate, results);
    return results;
  }

  _inOrderSearch(node, startDate, endDate, results) {
    if (!node) return;

    const nodeDate = new Date(node.record.record_date);

    if (nodeDate >= startDate && nodeDate <= endDate) {
      results.push(node.record);
    }

    if (nodeDate > startDate) {
      this._inOrderSearch(node.left, startDate, endDate, results);
    }

    if (nodeDate < endDate) {
      this._inOrderSearch(node.right, startDate, endDate, results);
    }
  }

  getAllRecordsChronological() {
    const results = [];
    this._inOrderTraversal(this.root, results);
    return results.reverse(); // Most recent first
  }

  _inOrderTraversal(node, results) {
    if (node) {
      this._inOrderTraversal(node.left, results);
      results.push(node.record);
      this._inOrderTraversal(node.right, results);
    }
  }
}

// Graph structure for doctor-patient relationships
class DoctorPatientGraph {
  constructor() {
    this.adjacencyList = new Map();
  }

  addDoctor(doctorId) {
    if (!this.adjacencyList.has(doctorId)) {
      this.adjacencyList.set(doctorId, new Set());
    }
  }

  addPatient(patientId, doctorId) {
    this.addDoctor(doctorId);
    this.adjacencyList.get(doctorId).add(patientId);
  }

  getDoctorPatients(doctorId) {
    return Array.from(this.adjacencyList.get(doctorId) || []);
  }

  getPatientDoctors(patientId) {
    const doctors = [];
    for (const [doctorId, patients] of this.adjacencyList) {
      if (patients.has(patientId)) {
        doctors.push(doctorId);
      }
    }
    return doctors;
  }

  getDoctorWorkload() {
    const workload = {};
    for (const [doctorId, patients] of this.adjacencyList) {
      workload[doctorId] = patients.size;
    }
    return workload;
  }

  findMostBusyDoctors(limit = 5) {
    const workload = this.getDoctorWorkload();
    return Object.entries(workload)
      .sort(([,a], [,b]) => b - a)
      .slice(0, limit)
      .map(([doctorId, patientCount]) => ({ doctorId: parseInt(doctorId), patientCount }));
  }
}

// Advanced Health Data Manager combining all data structures
class HealthDataManager {
  constructor() {
    this.doctorHash = new DoctorHashTable();
    this.medicalTermsTrie = new MedicalTermsTrie();
    this.treatmentQueue = new TreatmentPriorityQueue();
    this.apiCache = new LRUCache(100);
    this.recordsBST = new HealthRecordBST();
    this.doctorPatientGraph = new DoctorPatientGraph();
    
    this.initializeMedicalTerms();
  }

  initializeMedicalTerms() {
    const medicalTerms = [
      'Hypertension', 'Diabetes', 'Asthma', 'Migraine', 'Arthritis',
      'Bronchitis', 'Pneumonia', 'Influenza', 'Allergies', 'Depression',
      'Anxiety', 'Cardiovascular', 'Neurological', 'Dermatology',
      'Orthopedic', 'Gastroenterology', 'Endocrinology', 'Oncology',
      'Pediatrics', 'Geriatrics', 'Emergency', 'Surgery', 'Radiology',
      'Pathology', 'Anesthesiology', 'Cardiothoracic', 'Neurosurgery'
    ];

    medicalTerms.forEach(term => this.medicalTermsTrie.insert(term));
  }

  // Doctor management with hash table
  addDoctor(doctor) {
    this.doctorHash.set(doctor.doctor_id, doctor);
    this.doctorPatientGraph.addDoctor(doctor.doctor_id);
    this.apiCache.set(`doctor_${doctor.doctor_id}`, doctor);
  }

  getDoctor(doctorId) {
    let doctor = this.apiCache.get(`doctor_${doctorId}`);
    if (!doctor) {
      doctor = this.doctorHash.get(doctorId);
      if (doctor) {
        this.apiCache.set(`doctor_${doctorId}`, doctor);
      }
    }
    return doctor;
  }

  searchDoctorsBySpecialization(specialization) {
    return this.doctorHash.getAllDoctors()
      .filter(doctor => doctor.specialization?.toLowerCase().includes(specialization.toLowerCase()));
  }

  // Medical terms autocomplete
  getMedialSuggestions(prefix) {
    return this.medicalTermsTrie.search(prefix);
  }

  // Health records management with BST
  addHealthRecord(record) {
    this.recordsBST.insert(record);
    this.doctorPatientGraph.addPatient(record.user_id, record.doctor_id);
    
    // Cache user records
    const cacheKey = `user_records_${record.user_id}`;
    this.apiCache.set(cacheKey, null); // Invalidate cache
  }

  getUserRecordsInDateRange(userId, startDate, endDate) {
    const allRecords = this.recordsBST.findRecordsInDateRange(startDate, endDate);
    return allRecords.filter(record => record.user_id === userId);
  }

  getRecentRecords(userId, days = 30) {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    
    return this.getUserRecordsInDateRange(userId, startDate, endDate);
  }

  // Treatment priority management
  addTreatment(treatment) {
    const priority = this.calculateTreatmentPriority(treatment);
    this.treatmentQueue.enqueue(treatment, priority);
  }

  calculateTreatmentPriority(treatment) {
    const followUpDate = new Date(treatment.follow_up_date);
    const today = new Date();
    const daysUntilDue = Math.ceil((followUpDate - today) / (1000 * 60 * 60 * 24));
    
    // Lower number = higher priority
    let priority = daysUntilDue;
    
    // Adjust for severity (assumed from medication type)
    if (treatment.medication?.toLowerCase().includes('emergency') || 
        treatment.medication?.toLowerCase().includes('critical')) {
      priority -= 100;
    } else if (treatment.medication?.toLowerCase().includes('urgent')) {
      priority -= 50;
    }
    
    return Math.max(priority, 1); // Ensure positive priority
  }

  getNextUrgentTreatments(count = 5) {
    const urgentTreatments = [];
    const tempQueue = new TreatmentPriorityQueue();
    
    // Extract urgent treatments while preserving queue
    for (let i = 0; i < count && this.treatmentQueue.size() > 0; i++) {
      const treatment = this.treatmentQueue.dequeue();
      if (treatment) {
        urgentTreatments.push(treatment);
        tempQueue.enqueue(treatment, this.calculateTreatmentPriority(treatment));
      }
    }
    
    // Restore queue
    while (tempQueue.size() > 0) {
      const treatment = tempQueue.dequeue();
      this.treatmentQueue.enqueue(treatment, this.calculateTreatmentPriority(treatment));
    }
    
    return urgentTreatments;
  }

  // Analytics and insights
  getDoctorAnalytics() {
    return {
      totalDoctors: this.doctorHash.size,
      workloadDistribution: this.doctorPatientGraph.getDoctorWorkload(),
      mostBusyDoctors: this.doctorPatientGraph.findMostBusyDoctors(),
      specializationCounts: this.getSpecializationCounts()
    };
  }

  getSpecializationCounts() {
    const counts = {};
    this.doctorHash.getAllDoctors().forEach(doctor => {
      const spec = doctor.specialization || 'General';
      counts[spec] = (counts[spec] || 0) + 1;
    });
    return counts;
  }

  getUserHealthSummary(userId) {
    const cacheKey = `user_summary_${userId}`;
    let summary = this.apiCache.get(cacheKey);
    
    if (!summary) {
      const allRecords = this.recordsBST.getAllRecordsChronological()
        .filter(record => record.user_id === userId);
      
      const doctorIds = this.doctorPatientGraph.getPatientDoctors(userId);
      const recentRecords = this.getRecentRecords(userId, 30);
      
      summary = {
        totalRecords: allRecords.length,
        doctorsVisited: doctorIds.length,
        recentActivity: recentRecords.length,
        lastVisit: allRecords[0]?.record_date || null,
        commonConditions: this.getCommonConditions(allRecords)
      };
      
      this.apiCache.set(cacheKey, summary);
    }
    
    return summary;
  }

  getCommonConditions(records) {
    const conditions = {};
    records.forEach(record => {
      conditions[record.diagnosis] = (conditions[record.diagnosis] || 0) + 1;
    });
    
    return Object.entries(conditions)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([condition, count]) => ({ condition, count }));
  }

  // Cache management
  clearCache() {
    this.apiCache.clear();
  }

  getCacheStats() {
    return {
      size: this.apiCache.cache.size,
      maxSize: this.apiCache.maxSize
    };
  }
}

// Export for use in React components
export {
  DoctorHashTable,
  MedicalTermsTrie,
  TreatmentPriorityQueue,
  LRUCache,
  HealthRecordBST,
  DoctorPatientGraph,
  HealthDataManager
};

// Create global instance
export const healthDataManager = new HealthDataManager();
