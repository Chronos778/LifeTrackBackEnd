"""
Advanced Data Structures for Healthcare PHR System
Implements efficient data structures for better performance and functionality
"""

from collections import defaultdict, deque, Counter
from dataclasses import dataclass, field
from typing import Dict, List, Set, Optional, Tuple, Any
from datetime import datetime, timedelta
import heapq
from enum import Enum

class Severity(Enum):
    MILD = "mild"
    MODERATE = "moderate"
    CRITICAL = "critical"

@dataclass
class HealthRecord:
    """Enhanced health record with computed properties"""
    record_id: int
    user_id: int
    doctor_id: int
    diagnosis: str
    record_date: datetime
    severity: Severity = field(default=Severity.MILD)
    file_path: Optional[str] = None
    
    def __post_init__(self):
        self.severity = self._calculate_severity()
    
    def _calculate_severity(self) -> Severity:
        """Auto-classify severity based on diagnosis keywords"""
        critical_keywords = ['hypertension', 'diabetes', 'heart', 'cancer', 'stroke', 'emergency']
        moderate_keywords = ['asthma', 'allergies', 'migraine', 'arthritis', 'chronic']
        
        diagnosis_lower = self.diagnosis.lower()
        
        if any(keyword in diagnosis_lower for keyword in critical_keywords):
            return Severity.CRITICAL
        elif any(keyword in diagnosis_lower for keyword in moderate_keywords):
            return Severity.MODERATE
        return Severity.MILD

@dataclass
class Doctor:
    """Enhanced doctor model with analytics"""
    doctor_id: int
    name: str
    specialization: str
    contact_number: str = ""
    email: str = ""
    patient_count: int = 0
    avg_severity_score: float = 0.0

class HealthDataCache:
    """LRU-style cache for frequently accessed health data"""
    
    def __init__(self, max_size: int = 100):
        self.cache: Dict[str, Any] = {}
        self.access_order = deque()
        self.max_size = max_size
    
    def get(self, key: str):
        if key in self.cache:
            # Move to end (most recently used)
            self.access_order.remove(key)
            self.access_order.append(key)
            return self.cache[key]
        return None
    
    def put(self, key: str, value: Any):
        if key in self.cache:
            self.access_order.remove(key)
        elif len(self.cache) >= self.max_size:
            # Remove least recently used
            oldest = self.access_order.popleft()
            del self.cache[oldest]
        
        self.cache[key] = value
        self.access_order.append(key)

class PatientTimeline:
    """Advanced timeline data structure for patient health records"""
    
    def __init__(self):
        self.records_by_year: defaultdict = defaultdict(list)
        self.severity_index: defaultdict = defaultdict(list)
        self.doctor_visits: Counter = Counter()
        self.condition_frequency: Counter = Counter()
    
    def add_record(self, record: HealthRecord):
        """Add record and update all indices"""
        year = record.record_date.year
        self.records_by_year[year].append(record)
        self.severity_index[record.severity].append(record)
        self.doctor_visits[record.doctor_id] += 1
        self.condition_frequency[record.diagnosis] += 1
        
        # Sort records by date within each year
        self.records_by_year[year].sort(key=lambda r: r.record_date, reverse=True)
    
    def get_records_by_year(self, year: int) -> List[HealthRecord]:
        return self.records_by_year[year]
    
    def get_critical_records(self) -> List[HealthRecord]:
        return self.severity_index[Severity.CRITICAL]
    
    def get_most_visited_doctors(self, limit: int = 5) -> List[Tuple[int, int]]:
        """Returns list of (doctor_id, visit_count) tuples"""
        return self.doctor_visits.most_common(limit)
    
    def get_common_conditions(self, limit: int = 10) -> List[Tuple[str, int]]:
        """Returns most common diagnoses"""
        return self.condition_frequency.most_common(limit)

class DoctorAnalytics:
    """Advanced analytics for doctor performance and specialization"""
    
    def __init__(self):
        self.specialization_map: defaultdict = defaultdict(list)
        self.workload_heap: List[Tuple[int, int]] = []  # (patient_count, doctor_id)
        self.efficiency_scores: Dict[int, float] = {}
    
    def add_doctor(self, doctor: Doctor):
        """Add doctor to analytics structures"""
        self.specialization_map[doctor.specialization].append(doctor)
        heapq.heappush(self.workload_heap, (doctor.patient_count, doctor.doctor_id))
    
    def get_doctors_by_specialization(self, specialization: str) -> List[Doctor]:
        return self.specialization_map[specialization]
    
    def get_least_busy_doctors(self, count: int = 3) -> List[int]:
        """Get doctor IDs with lowest patient load"""
        return [heapq.heappop(self.workload_heap)[1] for _ in range(min(count, len(self.workload_heap)))]
    
    def calculate_efficiency_score(self, doctor_id: int, avg_severity: float, patient_count: int) -> float:
        """Calculate doctor efficiency based on patient load and case complexity"""
        if patient_count == 0:
            return 0.0
        
        # Higher severity cases = more complex = higher efficiency if handled well
        severity_weight = {'mild': 1.0, 'moderate': 1.5, 'critical': 2.0}
        base_score = avg_severity * 10
        load_factor = min(patient_count / 50, 2.0)  # Normalize patient load
        
        efficiency = base_score / load_factor if load_factor > 0 else base_score
        self.efficiency_scores[doctor_id] = efficiency
        return efficiency

class TreatmentPriorityQueue:
    """Priority queue for managing treatment follow-ups and urgent care"""
    
    def __init__(self):
        self.urgent_treatments: List[Tuple[int, datetime, int]] = []  # (priority, follow_up_date, treatment_id)
        self.overdue_treatments: Set[int] = set()
    
    def add_treatment(self, treatment_id: int, follow_up_date: datetime, severity: Severity):
        """Add treatment with priority based on severity and urgency"""
        priority = self._calculate_priority(follow_up_date, severity)
        heapq.heappush(self.urgent_treatments, (priority, follow_up_date, treatment_id))
        
        # Check if overdue
        if follow_up_date < datetime.now():
            self.overdue_treatments.add(treatment_id)
    
    def _calculate_priority(self, follow_up_date: datetime, severity: Severity) -> int:
        """Lower number = higher priority"""
        days_until_due = (follow_up_date - datetime.now()).days
        severity_modifier = {
            Severity.CRITICAL: 0,
            Severity.MODERATE: 10,
            Severity.MILD: 20
        }
        
        return days_until_due + severity_modifier[severity]
    
    def get_next_urgent_treatments(self, count: int = 5) -> List[int]:
        """Get most urgent treatment IDs"""
        urgent = []
        temp_heap = []
        
        for _ in range(min(count, len(self.urgent_treatments))):
            if self.urgent_treatments:
                priority, date, treatment_id = heapq.heappop(self.urgent_treatments)
                urgent.append(treatment_id)
                temp_heap.append((priority, date, treatment_id))
        
        # Restore heap
        for item in temp_heap:
            heapq.heappush(self.urgent_treatments, item)
        
        return urgent
    
    def get_overdue_treatments(self) -> Set[int]:
        return self.overdue_treatments.copy()

class HealthMetricsAggregator:
    """Aggregates and computes health metrics using advanced data structures"""
    
    def __init__(self):
        self.user_timelines: Dict[int, PatientTimeline] = {}
        self.doctor_analytics = DoctorAnalytics()
        self.treatment_queue = TreatmentPriorityQueue()
        self.cache = HealthDataCache()
    
    def add_health_record(self, record_data: dict):
        """Process and add health record to all relevant structures"""
        record = HealthRecord(
            record_id=record_data['record_id'],
            user_id=record_data['user_id'],
            doctor_id=record_data['doctor_id'],
            diagnosis=record_data['diagnosis'],
            record_date=datetime.fromisoformat(record_data['record_date']),
            file_path=record_data.get('file_path')
        )
        
        # Add to user timeline
        if record.user_id not in self.user_timelines:
            self.user_timelines[record.user_id] = PatientTimeline()
        
        self.user_timelines[record.user_id].add_record(record)
        
        # Invalidate relevant cache entries
        self.cache.put(f"user_timeline_{record.user_id}", None)
    
    def get_user_health_summary(self, user_id: int) -> dict:
        """Get comprehensive health summary for user"""
        cache_key = f"user_summary_{user_id}"
        cached = self.cache.get(cache_key)
        if cached:
            return cached
        
        if user_id not in self.user_timelines:
            return {"error": "No health records found"}
        
        timeline = self.user_timelines[user_id]
        
        summary = {
            "total_records": sum(len(records) for records in timeline.records_by_year.values()),
            "critical_conditions": len(timeline.get_critical_records()),
            "most_visited_doctors": timeline.get_most_visited_doctors(3),
            "common_conditions": timeline.get_common_conditions(5),
            "recent_activity": len([r for year_records in timeline.records_by_year.values() 
                                  for r in year_records 
                                  if (datetime.now() - r.record_date).days <= 30])
        }
        
        self.cache.put(cache_key, summary)
        return summary
    
    def get_system_analytics(self) -> dict:
        """Get system-wide analytics"""
        total_users = len(self.user_timelines)
        total_records = sum(sum(len(records) for records in timeline.records_by_year.values()) 
                           for timeline in self.user_timelines.values())
        
        # Severity distribution
        severity_dist = defaultdict(int)
        for timeline in self.user_timelines.values():
            for severity, records in timeline.severity_index.items():
                severity_dist[severity.value] += len(records)
        
        return {
            "total_users": total_users,
            "total_records": total_records,
            "severity_distribution": dict(severity_dist),
            "avg_records_per_user": total_records / total_users if total_users > 0 else 0
        }

# Global instance for the application
health_aggregator = HealthMetricsAggregator()
