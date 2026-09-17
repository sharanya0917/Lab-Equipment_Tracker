-- Equipment table
CREATE TABLE Equipment (
  equipment_id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  location TEXT NOT NULL,
  purchase_date TEXT,
  status TEXT NOT NULL CHECK (status IN ('Available','In-Use','Missing','Under Maintenance'))
);

-- Issue records
CREATE TABLE IssueRecord (
  issue_id INTEGER PRIMARY KEY AUTOINCREMENT,
  equipment_id TEXT NOT NULL,
  borrower_name TEXT NOT NULL,
  issue_date TEXT NOT NULL,
  expected_return_date TEXT NOT NULL,
  actual_return_date TEXT,
  condition_on_return TEXT,
  purpose TEXT,
  FOREIGN KEY (equipment_id) REFERENCES Equipment(equipment_id)
);

-- Maintenance records
CREATE TABLE MaintenanceRecord (
  maintenance_id INTEGER PRIMARY KEY AUTOINCREMENT,
  equipment_id TEXT NOT NULL,
  date TEXT NOT NULL,
  type TEXT NOT NULL,
  technician TEXT,
  cost REAL,
  notes TEXT,
  FOREIGN KEY (equipment_id) REFERENCES Equipment(equipment_id)
);

-- Seed 15 sample equipment rows
INSERT INTO Equipment (equipment_id, name, category, location, purchase_date, status) VALUES
('EQ-001', 'Oscilloscope', 'Instruments', 'Lab A', '2021-03-15', 'Available'),
('EQ-002', 'Centrifuge', 'Instruments', 'Lab B', '2020-11-02', 'Available'),
('EQ-003', 'Pipette Set', 'Glassware', 'Lab C', '2022-01-20', 'Available'),
('EQ-004', 'Multimeter', 'Electronics', 'Lab A', '2019-07-12', 'Available'),
('EQ-005', 'Incubator', 'Instruments', 'Lab D', '2021-09-30', 'Available'),
('EQ-006', 'Bunsen Burner', 'Glassware', 'Lab C', '2020-02-14', 'Available'),
('EQ-007', 'Spectrophotometer', 'Instruments', 'Lab B', '2022-06-05', 'Available'),
('EQ-008', 'Thermocycler', 'Instruments', 'Lab D', '2021-12-11', 'Available'),
('EQ-009', 'Microscope', 'Instruments', 'Lab A', '2018-04-22', 'Available'),
('EQ-010', 'Soldering Station', 'Electronics', 'Lab B', '2020-08-08', 'Available'),
('EQ-011', 'pH Meter', 'Instruments', 'Lab C', '2021-05-19', 'Available'),
('EQ-012', 'Petri Dish Set', 'Glassware', 'Lab D', '2019-10-03', 'Available'),
('EQ-013', 'Digital Balance', 'Electronics', 'Lab A', '2022-02-27', 'Available'),
('EQ-014', 'Freezer', 'Instruments', 'Lab B', '2020-12-15', 'Available'),
('EQ-015', 'Water Bath', 'Instruments', 'Lab C', '2021-11-01', 'Available'),
('EQ-016', 'Autoclave Sterilizer', 'Instruments', 'Lab B', '2021-08-14', 'Available'),
('EQ-017', 'Magnetic Stirrer & Hot Plate', 'Instruments', 'Lab C', '2022-04-10', 'Available'),
('EQ-018', 'Biological Safety Cabinet', 'Instruments', 'Lab D', '2020-05-18', 'Available'),
('EQ-019', 'Freeze Dryer (Lyophilizer)', 'Instruments', 'Lab B', '2021-09-05', 'Available'),
('EQ-020', 'Rotary Evaporator (Rotovap)', 'Instruments', 'Lab C', '2022-02-17', 'Available'),
('EQ-021', 'HPLC Chromatography System', 'Instruments', 'Lab B', '2020-10-22', 'Available'),
('EQ-022', 'Thermal Imaging Camera', 'Electronics', 'Lab A', '2021-01-19', 'Available'),
('EQ-023', 'Vortex Mixer', 'Instruments', 'Lab C', '2022-07-30', 'Available'),
('EQ-024', 'Function Generator', 'Electronics', 'Lab A', '2019-11-11', 'Available'),
('EQ-025', 'UV Transilluminator', 'Instruments', 'Lab D', '2021-03-25', 'Available'),
('EQ-026', 'Ultrasonic Bath Cleaner', 'Instruments', 'Lab C', '2020-09-12', 'Available'),
('EQ-027', 'GC-MS Spectrometer', 'Instruments', 'Lab B', '2019-06-08', 'Available'),
('EQ-028', 'Erlenmeyer Flask Set', 'Glassware', 'Lab C', '2022-05-01', 'Available'),
('EQ-029', 'Benchtop DC Power Supply', 'Electronics', 'Lab A', '2020-01-25', 'Available'),
('EQ-030', 'Cryogenic Liquid Nitrogen Tank', 'Instruments', 'Lab D', '2021-10-15', 'Available'),
('EQ-031', 'Transmission Electron Microscope', 'Instruments', 'Lab A', '2019-04-12', 'Available'),
('EQ-032', 'Atomic Force Microscope', 'Instruments', 'Lab A', '2021-06-20', 'Available'),
('EQ-033', 'Digital Logic Analyzer', 'Electronics', 'Lab A', '2020-03-14', 'Available'),
('EQ-034', 'Flow Cytometer', 'Instruments', 'Lab D', '2022-01-10', 'Available'),
('EQ-035', 'Volumetric Burette & Titration Stand', 'Glassware', 'Lab C', '2021-11-05', 'Available'),
('EQ-036', 'MALDI-TOF Mass Spectrometer', 'Instruments', 'Lab B', '2019-09-18', 'Available'),
('EQ-037', 'Vacuum Desiccator Chamber', 'Glassware', 'Lab C', '2020-07-22', 'Available'),
('EQ-038', 'LCR Impedance Meter', 'Electronics', 'Lab A', '2021-04-02', 'Available'),
('EQ-039', 'High-Speed Microcentrifuge', 'Instruments', 'Lab B', '2022-03-15', 'Available'),
('EQ-040', 'Gel Electrophoresis Chamber System', 'Instruments', 'Lab D', '2020-11-30', 'Available'),
('EQ-041', 'Digital Benchtop Refractometer', 'Instruments', 'Lab C', '2021-02-14', 'Available'),
('EQ-042', 'RF Spectrum Analyzer', 'Electronics', 'Lab A', '2019-12-01', 'Available'),
('EQ-043', 'Soxhlet Extractor Apparatus', 'Glassware', 'Lab C', '2022-06-18', 'Available'),
('EQ-044', 'Microplate Reader Fluorometer', 'Instruments', 'Lab B', '2021-08-25', 'Available'),
('EQ-045', 'Tissue Homogenizer', 'Instruments', 'Lab D', '2020-04-10', 'Available'),
('EQ-046', 'Desoldering Vacuum Station', 'Electronics', 'Lab A', '2021-10-08', 'Available'),
('EQ-047', 'Separatory Funnel Set', 'Glassware', 'Lab C', '2022-04-14', 'Available'),
('EQ-048', 'Automatic Digital Polarimeter', 'Instruments', 'Lab C', '2020-08-28', 'Available'),
('EQ-049', 'CO2 Water-Jacketed Incubator', 'Instruments', 'Lab D', '2019-05-15', 'Available'),
('EQ-050', 'Semiconductor Curve Tracer', 'Electronics', 'Lab A', '2020-02-01', 'Available');


