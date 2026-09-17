/**
 * Maps equipment names to:
 *  - emoji: a visually representative emoji icon
 *  - color: an accent color for the card border / background tint
 *  - img:   a public-domain image URL from Wikimedia Commons (HTTPS)
 *
 * Falls back gracefully to a generic flask icon when no match found.
 */
const EQUIPMENT_VISUALS = {
  // --- Instruments ---
  'oscilloscope':      { emoji: '📡', color: '#3b82f6', img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9a/Oscilloscope_tek_3026.jpg/320px-Oscilloscope_tek_3026.jpg' },
  'centrifuge':        { emoji: '🌀', color: '#8b5cf6', img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/20/Ultracentrifuge_open.jpg/320px-Ultracentrifuge_open.jpg' },
  'incubator':         { emoji: '🌡️', color: '#f59e0b', img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/79/Incubator_cabinet.jpg/320px-Incubator_cabinet.jpg' },
  'spectrophotometer': { emoji: '🔭', color: '#06b6d4', img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6b/Uv_vis_spectrophotometer.jpg/320px-Uv_vis_spectrophotometer.jpg' },
  'thermocycler':      { emoji: '🧬', color: '#10b981', img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e3/Thermal_cycler.jpg/320px-Thermal_cycler.jpg' },
  'microscope':        { emoji: '🔬', color: '#3b82f6', img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/14/Compound_microscope_nikon.jpg/320px-Compound_microscope_nikon.jpg' },
  'ph meter':          { emoji: '🧪', color: '#22c55e', img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f0/Mettler_Toledo_FiveEasy_pH_meter.jpg/320px-Mettler_Toledo_FiveEasy_pH_meter.jpg' },
  'freezer':           { emoji: '🧊', color: '#60a5fa', img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/ULT_Freezer.jpg/320px-ULT_Freezer.jpg' },
  'water bath':        { emoji: '💧', color: '#0ea5e9', img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9f/Waterbath_laboratory.jpg/320px-Waterbath_laboratory.jpg' },

  // --- Electronics ---
  'multimeter':        { emoji: '🔋', color: '#f97316', img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/22/Fluke87-V_Multimeter.jpg/240px-Fluke87-V_Multimeter.jpg' },
  'soldering station': { emoji: '🔌', color: '#ef4444', img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/ee/Soldering_station_Atten_936.jpg/320px-Soldering_station_Atten_936.jpg' },
  'digital balance':   { emoji: '⚖️', color: '#a855f7', img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d3/Digital_balance_scale.jpg/320px-Digital_balance_scale.jpg' },

  // --- Glassware ---
  'pipette set':       { emoji: '💉', color: '#14b8a6', img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e8/Micropipettes.jpg/320px-Micropipettes.jpg' },
  'bunsen burner':     { emoji: '🔥', color: '#f59e0b', img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/52/Bunsen_burner_flame.jpg/240px-Bunsen_burner_flame.jpg' },
  'petri dish set':    { emoji: '🫙', color: '#84cc16', img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/45/Agar_plate_with_colonies.jpg/320px-Agar_plate_with_colonies.jpg' },
  'erlenmeyer flask set': { emoji: '🧪', color: '#06b6d4', img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b8/Erlenmeyer_flasks.jpg/320px-Erlenmeyer_flasks.jpg' },

  // --- Advanced Analytical & Lab Gear ---
  'autoclave sterilizer': { emoji: '🏥', color: '#ec4899', img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/89/Autoclave_lab.jpg/320px-Autoclave_lab.jpg' },
  'magnetic stirrer & hot plate': { emoji: '🧲', color: '#f43f5e', img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/14/Magnetic_stirrer.jpg/320px-Magnetic_stirrer.jpg' },
  'biological safety cabinet': { emoji: '🛡️', color: '#10b981', img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/cd/Biosafety_cabinet_class_II.jpg/320px-Biosafety_cabinet_class_II.jpg' },
  'freeze dryer (lyophilizer)': { emoji: '❄️', color: '#38bdf8', img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6b/Freeze_dryer_lab.jpg/320px-Freeze_dryer_lab.jpg' },
  'rotary evaporator (rotovap)': { emoji: '⚗️', color: '#a855f7', img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1c/Rotary_evaporator_bench.jpg/320px-Rotary_evaporator_bench.jpg' },
  'hplc chromatography system': { emoji: '📈', color: '#6366f1', img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8a/HPLC_system.jpg/320px-HPLC_system.jpg' },
  'thermal imaging camera': { emoji: '📷', color: '#f97316', img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/84/FLIR_Thermal_Camera.jpg/320px-FLIR_Thermal_Camera.jpg' },
  'vortex mixer':      { emoji: '🌪️', color: '#14b8a6', img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7b/Vortex_mixer.jpg/320px-Vortex_mixer.jpg' },
  'function generator': { emoji: '⚡', color: '#eab308', img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a2/Function_generator.jpg/320px-Function_generator.jpg' },
  'uv transilluminator': { emoji: '💡', color: '#8b5cf6', img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5f/UV_transilluminator.jpg/320px-UV_transilluminator.jpg' },
  'ultrasonic bath cleaner': { emoji: '🔊', color: '#06b6d4', img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b3/Ultrasonic_cleaner.jpg/320px-Ultrasonic_cleaner.jpg' },
  'gc-ms spectrometer': { emoji: '🧬', color: '#4f46e5', img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d4/GC-MS_instrument.jpg/320px-GC-MS_instrument.jpg' },
  'benchtop dc power supply': { emoji: '🔌', color: '#ef4444', img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/05/DC_power_supply.jpg/320px-DC_power_supply.jpg' },
  'cryogenic liquid nitrogen tank': { emoji: '🧊', color: '#0284c7', img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d2/Liquid_nitrogen_tank.jpg/320px-Liquid_nitrogen_tank.jpg' },

  // --- Extended High-Tech & Specialty Equipment ---
  'transmission electron microscope': { emoji: '🔬', color: '#3b82f6', img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2c/TEM_Jeol.jpg/320px-TEM_Jeol.jpg' },
  'atomic force microscope':          { emoji: '📐', color: '#8b5cf6', img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/18/Atomic_force_microscope.jpg/320px-Atomic_force_microscope.jpg' },
  'digital logic analyzer':           { emoji: '📊', color: '#06b6d4', img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/23/Logic_analyzer.jpg/320px-Logic_analyzer.jpg' },
  'flow cytometer':                    { emoji: '🩸', color: '#ec4899', img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/52/Flow_cytometer.jpg/320px-Flow_cytometer.jpg' },
  'volumetric burette & titration stand': { emoji: '🧪', color: '#10b981', img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3b/Titration_apparatus.jpg/320px-Titration_apparatus.jpg' },
  'maldi-tof mass spectrometer':      { emoji: '🧬', color: '#4f46e5', img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/58/MALDI-TOF.jpg/320px-MALDI-TOF.jpg' },
  'vacuum desiccator chamber':        { emoji: '🫙', color: '#64748b', img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/69/Vacuum_desiccator.jpg/320px-Vacuum_desiccator.jpg' },
  'lcr impedance meter':              { emoji: '⚡', color: '#f59e0b', img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b5/LCR_meter.jpg/320px-LCR_meter.jpg' },
  'high-speed microcentrifuge':       { emoji: '🌀', color: '#a855f7', img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/20/Ultracentrifuge_open.jpg/320px-Ultracentrifuge_open.jpg' },
  'gel electrophoresis chamber system': { emoji: '🧬', color: '#0ea5e9', img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4e/Gel_electrophoresis_apparatus.jpg/320px-Gel_electrophoresis_apparatus.jpg' },
  'digital benchtop refractometer':   { emoji: '🔍', color: '#14b8a6', img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3d/Refractometer.jpg/320px-Refractometer.jpg' },
  'rf spectrum analyzer':             { emoji: '📡', color: '#3b82f6', img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/77/Spectrum_analyzer.jpg/320px-Spectrum_analyzer.jpg' },
  'soxhlet extractor apparatus':      { emoji: '⚗️', color: '#eab308', img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/91/Soxhlet_extractor.jpg/320px-Soxhlet_extractor.jpg' },
  'microplate reader fluorometer':    { emoji: '💡', color: '#8b5cf6', img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/84/Plate_reader.jpg/320px-Plate_reader.jpg' },
  'tissue homogenizer':               { emoji: '🌀', color: '#ef4444', img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7b/Vortex_mixer.jpg/320px-Vortex_mixer.jpg' },
  'desoldering vacuum station':       { emoji: '🔌', color: '#f97316', img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/ee/Soldering_station_Atten_936.jpg/320px-Soldering_station_Atten_936.jpg' },
  'separatory funnel set':            { emoji: '🧪', color: '#10b981', img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9a/Separatory_funnel.jpg/320px-Separatory_funnel.jpg' },
  'automatic digital polarimeter':    { emoji: '🔭', color: '#06b6d4', img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5a/Polarimeter.jpg/320px-Polarimeter.jpg' },
  'co2 water-jacketed incubator':     { emoji: '🌡️', color: '#f59e0b', img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/79/Incubator_cabinet.jpg/320px-Incubator_cabinet.jpg' },
  'semiconductor curve tracer':       { emoji: '📈', color: '#6366f1', img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9a/Oscilloscope_tek_3026.jpg/320px-Oscilloscope_tek_3026.jpg' },
};



/** Category fallbacks when no name match */
const CATEGORY_FALLBACK = {
  'Instruments': { emoji: '⚗️', color: '#6366f1', img: null },
  'Electronics': { emoji: '🔌', color: '#f97316', img: null },
  'Glassware':   { emoji: '🧪', color: '#10b981', img: null },
  'Other':       { emoji: '🔬', color: '#94a3b8', img: null },
};

export function getVisuals(name = '', category = '') {
  const key = name.toLowerCase().trim();
  return (
    EQUIPMENT_VISUALS[key] ||
    CATEGORY_FALLBACK[category] ||
    { emoji: '🔬', color: '#6366f1', img: null }
  );
}
