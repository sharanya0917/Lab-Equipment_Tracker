/**
 * Comprehensive Operating Instructions, Safety Protocols, and Sterilization Procedures
 * for all Laboratory Equipment (EQ-001 through EQ-030).
 */

const INSTRUCTIONS_DATABASE = {
  'EQ-001': {
    operating_steps: [
      'Connect BNC coaxial probe to Channel 1 input terminal.',
      'Connect probe ground alligator clip to circuit ground reference.',
      'Calibrate probe compensation using built-in 1kHz 3V p-p square wave test terminal.',
      'Adjust Volts/Div and Time/Div control dials until signal waveform is centered.',
      'Set Trigger Mode to AUTO/SINGLE to freeze transient waveform events.'
    ],
    safety_warnings: [
      'Do not exceed maximum peak input voltage rating (400V pk).',
      'Ensure chassis earth ground pin is firmly grounded.',
      'Wear ESD anti-static wrist strap when probing sensitive CMOS IC components.'
    ],
    sterilization_protocol: 'Wipe outer casing and insulated probe tips with 70% Isopropanol wipes. Do not submerge probes in liquid reagents.'
  },

  'EQ-002': {
    operating_steps: [
      'Inspect rotor, buckets, and micro-centrifuge tubes for visible micro-cracks.',
      'Balance sample tubes symmetrically across rotor axis by mass within 0.05g accuracy.',
      'Firmly screw rotor lid shut until safety interlock engages with an audible click.',
      'Set target rotational speed (up to 15,000 RPM) and run duration timer.',
      'Press START and wait for motor spin cycle to complete.'
    ],
    safety_warnings: [
      'NEVER attempt to open centrifuge lid while rotor is in motion.',
      'Unbalanced sample loads trigger critical vibration interlocks and mechanical damage.',
      'Handle biohazardous sample tubes with certified aerosol-tight sealed buckets.'
    ],
    sterilization_protocol: 'Autoclave removable aluminum rotor buckets at 121°C for 20 mins. Spray chamber interior with 70% Ethanol post-run.'
  },

  'EQ-003': {
    operating_steps: [
      'Select micropipette matching target volume range (P20, P200, or P1000).',
      'Attach a sterile disposable polypropylene pipette tip from box.',
      'Depress plunger to first stop before submersing tip 2-3mm into liquid sample.',
      'Slowly release plunger to aspirate liquid without introducing air bubbles.',
      'Dispense into target tube by depressing plunger to second blow-out stop.'
    ],
    safety_warnings: [
      'Never invert pipette horizontally while liquid is inside the tip.',
      'Do not force volume adjustment dial past maximum rated volume limits.',
      'Use filter tips when handling volatile, corrosive, or radioactive liquids.'
    ],
    sterilization_protocol: 'Eject used tips into biohazard bin. Autoclave lower shaft assembly at 121°C (15 psi) for 20 minutes.'
  },

  'EQ-004': {
    operating_steps: [
      'Plug red probe lead into V/Ω input terminal and black probe lead into COM jack.',
      'Rotate central selector dial to target measurement domain (DCV, ACV, Ω, or A).',
      'Touch probe tips firmly to circuit nodes under test.',
      'Read digital display measurement and observe auto-ranging decimal point.'
    ],
    safety_warnings: [
      'Disconnect power from circuit prior to measuring resistance (Ω) or continuity.',
      'Never attempt voltage measurements while lead is connected to 10A current jack.',
      'Inspect probe insulation leads for tears prior to high-voltage (>50V) testing.'
    ],
    sterilization_protocol: 'Wipe meter housing and probe leads with disinfectant wipe. Store in padded ESD protective pouch.'
  },

  'EQ-005': {
    operating_steps: [
      'Verify water pan level in bottom reservoir to maintain 95% relative humidity.',
      'Set digital temperature controller to 37.0°C and CO2 concentration to 5.0%.',
      'Place cell culture plates or flasks onto stainless steel perforated shelves.',
      'Close inner glass door first, then latch main insulated door.'
    ],
    safety_warnings: [
      'Wear thermal insulated gloves when handling heated glass culture vessels.',
      'Minimize main door open duration to prevent ambient cold draft air turbulence.',
      'Verify ambient gas cylinder supply pressure to prevent CO2 starvation.'
    ],
    sterilization_protocol: 'Perform monthly high-temperature (90°C) dry heat decontamination cycle. Wipe shelves with quaternary ammonium cleaner.'
  },

  'EQ-006': {
    operating_steps: [
      'Inspect flexible rubber gas hose for dry rot, micro-cracks, or loose clamp fittings.',
      'Close air collar adjustment ring at base of burner tube.',
      'Open main lab gas supply bench valve and ignite gas stream using spark striker.',
      'Rotate air collar ring until inner pale-blue flame cone is clearly defined.'
    ],
    safety_warnings: [
      'Tie back long hair and secure loose lab clothing prior to lighting burner.',
      'Never leave open flame burner unattended under any circumstances.',
      'Maintain minimum 2-meter safety clearance from flammable organic solvents.'
    ],
    sterilization_protocol: 'Allow burner to cool completely to room temperature. Wipe brass base with damp cloth and clear gas orifice with pin.'
  },

  'EQ-007': {
    operating_steps: [
      'Turn on spectrophotometer power switch and allow halogen/deuterium lamps 15m warm-up.',
      'Select analytical measurement wavelength (e.g. 260nm for DNA, 595nm for Bradford).',
      'Insert blank reference cuvette containing buffer solution into sample holder.',
      'Press ZERO/BLANK button to calibrate 100% Transmittance (0.000 Absorbance).',
      'Replace with sample cuvette and record digital absorbance output value.'
    ],
    safety_warnings: [
      'Do not stare directly into UV deuterium lamp optical path (causes corneal burns).',
      'Handle quartz cuvettes exclusively by frosted sides; clean optical faces with lens paper.',
      'Avoid liquid overflow inside sample compartment.'
    ],
    sterilization_protocol: 'Clean sample compartment immediately if liquid spills occur using lint-free optical wipes soaked in 70% Isopropanol.'
  },

  'EQ-008': {
    operating_steps: [
      'Load 0.2mL thin-wall PCR strip tubes or 96-well reaction plate into alloy block.',
      'Close heated lid mechanism and tighten lid compression knob.',
      'Select thermal cycling program (e.g. Denaturation 95°C, Annealing 55°C, Extension 72°C).',
      'Press RUN PROGRAM and monitor real-time cycle status on digital screen.'
    ],
    safety_warnings: [
      'Heated lid operates at 105°C — burn hazard! Avoid touching lid surface during cycle.',
      'Ensure sample tubes are sealed tightly to prevent reaction volume evaporation.',
      'Allow block to cool to 4°C hold stage before opening lid post-run.'
    ],
    sterilization_protocol: 'Clean sample block wells with cotton swabs dampened with 70% Isopropanol. Run built-in UV germicidal decontamination if available.'
  },

  'EQ-009': {
    operating_steps: [
      'Place specimen glass slide onto mechanical stage and secure with spring clip.',
      'Turn on bottom LED illuminator and adjust iris diaphragm for contrast.',
      'Focus specimen starting at 4x objective using coarse adjustment knob.',
      'Rotate turret to 10x, 40x, and apply immersion oil for 100x high-power lens.'
    ],
    safety_warnings: [
      'Use lens tissue paper exclusively for optical glass components.',
      'Never force coarse focus knob upward while 100x immersion lens is near glass slide.',
      'Turn off light source when not in active use to prolong LED module lifespan.'
    ],
    sterilization_protocol: 'Clean immersion oil from 100x objective lens immediately after use using specialized optical lens paper and lens cleaner solution.'
  },

  'EQ-010': {
    operating_steps: [
      'Dampen cleaning brass wire wheel and cellulose sponge with deionized water.',
      'Set digital temperature controller setpoint to 350°C - 380°C.',
      'Apply fresh solder wire to iron tip to tin tip prior to soldering joint.',
      'Touch tinned iron tip simultaneously to component pin and PCB pad.',
      'Return iron pencil to metal safety cradle holder when pausing work.'
    ],
    safety_warnings: [
      'Iron tip reaches 400°C — severe burn hazard! Use under active fume extraction hood.',
      'Wear safety glasses to protect against solder flux spatter.',
      'Wash hands thoroughly after handling lead-based solder alloys.'
    ],
    sterilization_protocol: 'Turn off power and let iron cool completely to room temperature. Wipe stand base and tin tip with protective rosin flux coating.'
  },

  'EQ-011': {
    operating_steps: [
      'Remove protective storage bottle from glass bulb electrode.',
      'Rinse electrode body thoroughly with deionized water and blot dry with Kimwipe.',
      'Submerge probe into pH 7.00, 4.01, and 10.01 calibration buffer standards.',
      'Press CALIBRATE button until 3-point calibration slope is accepted (>95%).',
      'Immerse electrode into sample solution and record stabilized pH value.'
    ],
    safety_warnings: [
      'Never allow sensitive glass bulb electrode to dry out; store in 3M KCl solution.',
      'Do not use glass electrode in HF (Hydrofluoric Acid) solutions.',
      'Handle fragile glass bulb with care to prevent breakage.'
    ],
    sterilization_protocol: 'Rinse electrode with DI water post-sample. Store in 3M KCl electrolyte storage cap. Soak in 0.1M HCl for 15 mins if fouled.'
  },

  'EQ-012': {
    operating_steps: [
      'Pour sterile molten agar growth medium (50°C) into petri dish base under hood.',
      'Allow agar to cool and solidify for 30 minutes under sterile laminar airflow.',
      'Inoculate microbial strain using flame-sterilized platinum loop.',
      'Invert petri dish upside down to prevent condensation droplets falling on agar.',
      'Place in incubator at 37°C for 24-48 hours.'
    ],
    safety_warnings: [
      'Keep dish lid closed except during active streak inoculation procedures.',
      'Wear nitrile gloves when handling pathogenic microbial cultures.',
      'Dispose of biohazardous culture plates in dedicated autoclave disposal bags.'
    ],
    sterilization_protocol: 'Autoclave used petri dish cultures at 121°C (15 psi) for 30 minutes before hazardous biological waste disposal.'
  },

  'EQ-013': {
    operating_steps: [
      'Check Spirit level bubble indicator at rear base of balance to ensure level.',
      'Place weighing paper or glass boat onto center of stainless steel pan.',
      'Press TARE / ZERO button to zero the digital display reading.',
      'Add chemical reagent powder using micro-spatula until target mass is reached.',
      'Record mass to 0.0001g precision.'
    ],
    safety_warnings: [
      'Close glass draft shield sliding doors before taking final weight measurement.',
      'Do not exceed maximum capacity rating (220g max).',
      'Wear protective dusk mask when weighing hazardous chemical powders.'
    ],
    sterilization_protocol: 'Clean weighing chamber and pan gently using camel-hair brush. Wipe stainless pan with 70% Ethanol wipes.'
  },

  'EQ-014': {
    operating_steps: [
      'Put on heavy cryo-insulated safety gloves and full face shield.',
      'Unlatch outer freezer door handle and inner sub-chamber compartment door.',
      'Locate target rack and pull out metal inventory box using indexing chart.',
      'Retrieve sample vial quickly and close inner sub-door within 30 seconds.'
    ],
    safety_warnings: [
      'Ultra-low temperature (-80°C) causes severe frostbite skin burns within seconds!',
      'Always wear cryo-gloves, safety goggles, and lab coat.',
      'Never leave freezer door open longer than necessary to prevent thermal alarm.'
    ],
    sterilization_protocol: 'Perform annual defrosting procedure. Clean interior stainless walls with 70% Ethanol solution and check door gasket seals.'
  },

  'EQ-015': {
    operating_steps: [
      'Fill stainless steel bath reservoir with distilled water up to fill indicator line.',
      'Set digital temperature controller to target setpoint (e.g. 37°C or 56°C).',
      'Allow water temperature to stabilize (verified by thermometer).',
      'Place test tube rack into floating bath tray ensuring sample tubes are submerged.'
    ],
    safety_warnings: [
      'Never turn on bath heating elements when reservoir is empty (dry burn hazard).',
      'Use thermal resistant gloves when handling samples from high-temp (>60°C) baths.',
      'Avoid liquid contact with electrical control housing panel.'
    ],
    sterilization_protocol: 'Drain water bath weekly. Clean reservoir stainless surface with laboratory detergent and treat with anti-algal water additive.'
  },

  'EQ-016': {
    operating_steps: [
      'Fill steam generator reservoir with deionized water up to marked level.',
      'Load biological waste, culture media, or glassware into wire sterilization basket.',
      'Apply autoclave indicator tape to items to verify temperature exposure.',
      'Close chamber door and rotate door locking wheel securely.',
      'Select cycle (121°C, 15 psi, 20 mins) and press START.'
    ],
    safety_warnings: [
      'HIGH-PRESSURE STEAM HAZARD! Never attempt to open door while chamber is pressurized.',
      'Wait until pressure gauge drops to 0 psi and temperature is <80°C before unlatching door.',
      'Wear heat-resistant safety gloves and face shield when unloading hot items.'
    ],
    sterilization_protocol: 'Drain condensate reservoir daily. Wipe silicone door gasket seal with damp cloth and inspect for steam leaks.'
  },

  'EQ-017': {
    operating_steps: [
      'Drop PTFE-coated magnetic stir bar into liquid solution beaker.',
      'Place beaker centrally on ceramic top plate.',
      'Turn STIR dial clockwise to initiate smooth magnetic vortex rotation.',
      'Turn HEAT dial to set target temperature setpoint (up to 300°C).'
    ],
    safety_warnings: [
      'Top plate remains extremely hot (>300°C) long after heat switch is turned OFF!',
      'Keep flammable organic solvents away from hot plate surface.',
      'Ensure stir bar speed is increased gradually to prevent splashing.'
    ],
    sterilization_protocol: 'Allow plate to cool completely to ambient room temperature. Wipe ceramic top surface with mild soap water or ethanol wipes.'
  },

  'EQ-018': {
    operating_steps: [
      'Turn on cabinet blower fan and allow air laminar flow to purge cabinet for 5 mins.',
      'Check magnehelic pressure gauge reading to verify HEPA filter airflow.',
      'Adjust glass sash window to marked working sash height (8-10 inches).',
      'Wipe down interior stainless steel work surface with 70% Ethanol prior to work.',
      'Perform culture work in middle third of cabinet work area.'
    ],
    safety_warnings: [
      'Do not block front intake grill or rear exhaust slots with elbows or paper.',
      'Never keep hands or head outside cabinet while handling Class II biohazards.',
      'Turn OFF UV lamp before working in cabinet to prevent skin radiation exposure.'
    ],
    sterilization_protocol: 'Wipe all interior walls and catch pan with 70% Ethanol post-work. Run UV germicidal lamp cycle for 15-30 minutes.'
  },

  'EQ-019': {
    operating_steps: [
      'Pre-freeze biological samples in ultra-low freezer (-80°C) in shell-frozen flasks.',
      'Turn on condenser refrigeration unit and wait for temp to reach -50°C or lower.',
      'Start vacuum pump and monitor vacuum display until pressure drops below 100 mTorr.',
      'Connect freeze-drying flask to manifold valve port and turn valve knob to open.'
    ],
    safety_warnings: [
      'High vacuum hazard! Inspect glass flasks for hairline cracks to prevent implosion.',
      'Wear safety glasses and thick protective gloves when handling cryogenic cold traps.',
      'Ensure vacuum exhaust is vented safely.'
    ],
    sterilization_protocol: 'Defrost ice collector condenser coil post-run. Drain water condensate into collector vessel and disinfect with 10% bleach.'
  },

  'EQ-020': {
    operating_steps: [
      'Fill heating bath with water and set temperature to 40°C - 50°C.',
      'Attach sample flask to glass bump trap joint and secure with keck clip.',
      'Turn on vacuum pump and adjust vacuum regulator valve.',
      'Turn rotation dial to spin flask at 100 - 150 RPM.',
      'Turn on recirculating chiller to circulate 4°C coolant through glass condenser coil.'
    ],
    safety_warnings: [
      'Glassware under vacuum — implosion risk! Wear chemical splash goggles.',
      'Perform rotary evaporation of toxic solvents inside a certified fume hood.',
      'Do not overfill evaporation flask beyond 50% capacity.'
    ],
    sterilization_protocol: 'Empty solvent receiver flask into hazardous organic waste drum. Clean glass taper joints with acetone and re-grease with silicone grease.'
  },

  'EQ-021': {
    operating_steps: [
      'Degas HPLC grade mobile phase solvents using inline vacuum degasser.',
      'Purge pump lines at 2.0 mL/min flow rate to eliminate micro-bubbles.',
      'Equilibrate reverse-phase C18 analytical column at target flow rate (1.0 mL/min).',
      'Load sample vials into 96-well autosampler tray.',
      'Initiate chromatographic run method and monitor UV detector absorbance profile.'
    ],
    safety_warnings: [
      'High fluid pressure hazard (>200 bar)! Inspect PEEK tubing and fittings for leaks.',
      'Ensure solvent waste carboy is vented into activated carbon exhaust filter.',
      'Wear nitrile gloves and safety glasses when handling organic mobile phases (MeCN, MeOH).'
    ],
    sterilization_protocol: 'Flush column with 100% Methanol or Isopropanol post-analysis to purge bound sample residue. Store column in 80% Organic / 20% Water.'
  },

  'EQ-022': {
    operating_steps: [
      'Remove Germanium lens cover cap and power ON camera unit.',
      'Aim thermal imager at target electronic circuit or mechanical bearing.',
      'Rotate optical focus ring until thermal image edges are crisp.',
      'Select color palette mode (Ironbow, Rainbow, or Grayscale).',
      'Set target material emissivity factor (e.g. 0.95 for matte black surfaces).',
      'Pull trigger button to save radiometric thermal image file.'
    ],
    safety_warnings: [
      'Do not point infrared detector lens directly at high-power laser sources or the sun.',
      'Avoid dropping camera housing; optical Germanium lens elements are fragile.',
      'Charge lithium battery using approved charger unit only.'
    ],
    sterilization_protocol: 'Wipe camera body with microfiber cloth dampened with mild lens cleaner. Clean optical lens exclusively with camera lens blower brush.'
  },

  'EQ-023': {
    operating_steps: [
      'Select operating mode toggle (TOUCH vs CONTINUOUS agitation).',
      'Adjust rotational speed dial (500 RPM to 3,000 RPM).',
      'Firmly press micro-centrifuge tube base onto rubber cup head attachment.',
      'Vortex sample tube for 5-10 seconds to homogenize liquid contents.'
    ],
    safety_warnings: [
      'Ensure tube cap is sealed completely tight before vortexing to prevent spattering.',
      'Do not vortex open glass vessels or cracked micro-tubes.',
      'Hold tube firmly to prevent tube slipping off high-speed rubber cup.'
    ],
    sterilization_protocol: 'Remove rubber cup attachment and wipe clean with 70% Isopropanol wipes to remove spilled biological reagents.'
  },

  'EQ-024': {
    operating_steps: [
      'Connect BNC output cable to MAIN OUTPUT jack of function generator.',
      'Select output signal waveform geometry (Sine, Square, Triangle, or Pulse).',
      'Set frequency range buttons and adjust main frequency vernier dial (e.g. 10.0 kHz).',
      'Adjust Peak-to-Peak Amplitude knob (Vp-p) using oscilloscope monitoring.',
      'Enable OUTPUT ON switch to feed signal to test circuit.'
    ],
    safety_warnings: [
      'Never connect function generator output directly to live AC mains voltage sources!',
      'Do not feed external high-voltage signals back into generator output BNC jack.',
      'Verify ground clip polarity before connecting to powered circuit boards.'
    ],
    sterilization_protocol: 'Wipe front control panel and rotary knobs with dry anti-static microfiber cloth.'
  },

  'EQ-025': {
    operating_steps: [
      'Place stained agarose gel onto UV glass filter stage plate.',
      'Lower amber protective UV shield cover completely over stage.',
      'Turn ON 302nm UV illuminator switch.',
      'Observe DNA band fluorescence through amber safety shield or gel doc camera camera.'
    ],
    safety_warnings: [
      'CRITICAL UV RADIATION HAZARD! UV light causes severe skin burns and eye damage.',
      'ALWAYS ensure amber shield is fully down and wear certified UV-blocking face shield.',
      'Turn off UV lamps immediately after gel imaging.'
    ],
    sterilization_protocol: 'Clean glass stage filter plate with deionized water and soft lint-free cloth post-use. Do not use abrasive cleaners that scratch filter.'
  },

  'EQ-026': {
    operating_steps: [
      'Fill stainless steel ultrasonic tank with DI water or cleaning detergent to fill mark.',
      'Place dirty metal tools, glass cuvettes, or parts into stainless wire basket.',
      'Lower basket into liquid bath (do not rest tools directly on tank bottom).',
      'Set digital sonication timer (e.g. 10 mins) and heating control (40°C).',
      'Press SONIC button to start 40kHz acoustic cavitation cycle.'
    ],
    safety_warnings: [
      'Do not place fingers or hands directly into active ultrasonic bath (damages joints).',
      'Never run ultrasonic unit without liquid in tank (destroys transducer element).',
      'Cover bath with lid during sonication to reduce acoustic noise level.'
    ],
    sterilization_protocol: 'Drain dirty cleaning liquid via bottom drain valve. Rinse tank interior with clean water and wipe dry.'
  },

  'EQ-027': {
    operating_steps: [
      'Verify Helium carrier gas tank supply pressure is >80 psi.',
      'Heat GC column oven, inlet port (250°C), and MS transfer line (280°C).',
      'Perform Mass Spectrometer auto-tune and verify low air/water background levels.',
      'Inject 1.0 µL sample into split/splitless injection port using micro-syringe.',
      'Initiate GC oven temperature ramp program and MS data acquisition.'
    ],
    safety_warnings: [
      'Inlet port and MS interface operate at >300°C — high thermal burn risk!',
      'Helium and hydrogen gas cylinders under high pressure; secure with safety chains.',
      'Wear safety glasses when handling micro-syringes.'
    ],
    sterilization_protocol: 'Bake out capillary column at 300°C for 1 hour periodically to clear high-boiling sample residues. Clean inlet liner and replace septum.'
  },

  'EQ-028': {
    operating_steps: [
      'Inspect borosilicate glass flask body and rim for chips or hairline cracks.',
      'Fill flask with chemical reaction solution or growth medium.',
      'Insert sterile silicone stopper, foam plug, or aluminum foil cap onto neck.',
      'Place on magnetic stirrer or orbital shaker table to agitate solution.'
    ],
    safety_warnings: [
      'Do not heat flask with closed rigid stopper (pressure explosion hazard).',
      'Use thermal insulated safety silicon gloves when handling hot flasks.',
      'Never subject glassware to sudden thermal shock (>100°C delta).'
    ],
    sterilization_protocol: 'Wash with laboratory glassware detergent, rinse 3x with deionized water, and autoclave at 121°C for 30 minutes.'
  },

  'EQ-029': {
    operating_steps: [
      'Turn voltage adjustment knob fully counter-clockwise to zero before powering ON.',
      'Connect red banana cable to (+) terminal and black cable to (-) terminal.',
      'Set target output DC voltage (e.g. +5.0V, +12.0V, or +24.0V).',
      'Set Current Limit control knob to match safe circuit threshold (e.g. 500mA).',
      'Press OUTPUT ON button to energize output leads.'
    ],
    safety_warnings: [
      'Verify circuit polarity (+ / -) before enabling power to prevent component burnout.',
      'Do not short-circuit output terminals when high current limit is set.',
      'Keep liquids away from benchtop power supply top ventilation grilles.'
    ],
    sterilization_protocol: 'Wipe metal chassis enclosure and binding post jacks with electrical contact cleaning wipes.'
  },

  'EQ-030': {
    operating_steps: [
      'Put on heavy cryo-insulated safety gloves, leather apron, and full face shield.',
      'Slowly vent tank pressure valve to depressurize neck space.',
      'Remove insulated tank neck plug and insert stainless steel retrieval hook.',
      'Lift internal metal inventory canister rack out of liquid nitrogen phase.',
      'Extract target cryo-vial using long forceps and return rack into tank immediately.'
    ],
    safety_warnings: [
      'SEVERE CRYOGENIC FROSTBITE & ASPHYXIATION HAZARDS!',
      'Liquid Nitrogen (-196°C) causes instant tissue destruction.',
      'Operate LN2 tank exclusively in well-ventilated rooms equipped with active O2 monitors!'
    ],
    sterilization_protocol: 'Inspect outer vacuum vessel for frost ring formation indicating vacuum insulation envelope failure.'
  },

  'EQ-031': {
    operating_steps: [
      'Mount ultra-thin (50nm) grid specimen into specimen holder rod under vacuum environment.',
      'Initiate column high-vacuum system (<10^-5 Pa).',
      'Energize Field Emission Gun (FEG) electron source at 200kV accelerating potential.',
      'Adjust intermediate and objective magnetic lens focus for atomic lattice resolution.',
      'Capture brightfield/darkfield image via CCD camera.'
    ],
    safety_warnings: [
      'HIGH VOLTAGE & X-RAY HAZARDS! Operating potential reaches 200,000 Volts.',
      'Inspect X-ray lead shielding integrity prior to beam energization.',
      'Handle TEM copper grids exclusively with anti-magnetic high-precision tweezers.'
    ],
    sterilization_protocol: 'Plasma clean specimen holder rod in Argon/Oxygen plasma cleaner for 2 mins to remove hydrocarbon contamination.'
  },

  'EQ-032': {
    operating_steps: [
      'Mount silicon cantilever probe tip into piezo scanner head.',
      'Align laser diode spot onto back of cantilever using top-view optic camera.',
      'Position photodiode sensor until vertical and horizontal differential voltage reads 0.0V.',
      'Execute auto-approach until probe tip engages sample surface in Tapping Mode.',
      'Scan 5µm x 5µm surface grid and record topographical height profile.'
    ],
    safety_warnings: [
      'Fragile silicon cantilever tip (radius <10nm); avoid physical contact with hard objects.',
      'Enclose scanner in acoustic isolation box to eliminate ambient vibration noise.',
      'Do not exceed maximum Z-piezo travel range.'
    ],
    sterilization_protocol: 'Rinse sample puck holder with Isopropanol and blow dry with ultra-pure filtered Nitrogen gas.'
  },

  'EQ-033': {
    operating_steps: [
      'Attach high-density flying lead clips to digital bus lines under test (SPI, I2C, UART).',
      'Connect ground lead firmly to target PCB ground plane.',
      'Set logic threshold voltage (e.g. 3.3V CMOS or 1.8V Low Voltage logic).',
      'Set trigger condition on rising/falling clock edge.',
      'Capture logic trace buffer and decode protocol packets.'
    ],
    safety_warnings: [
      'Inspect flying lead insulation for damage before probing live circuits.',
      'Do not apply input voltages exceeding logic threshold limits (±15V max).',
      'Wear grounded ESD anti-static wrist strap during probing.'
    ],
    sterilization_protocol: 'Wipe probe leads and clip harnesses with anti-static disinfectant wipes.'
  },

  'EQ-034': {
    operating_steps: [
      'Verify sheath fluid reservoir level and empty waste carboy.',
      'Run fluidic startup and fluidic de-gas cycle.',
      'Calibrate laser alignment and PMT sensitivity using fluorosphere bead standards.',
      'Vortex fluorescently stained cell suspension (FITC, PE, APC markers).',
      'Load sample tube onto aspirator port and record 50,000 single-cell events.'
    ],
    safety_warnings: [
      'BIOHAZARD HAZARD! Handle human/animal cell suspensions with BSL-2 precautions.',
      'Wear safety goggles and lab coat to prevent laser exposure and aerosol inhalation.',
      'Ensure waste tank contains active bleach before disposal.'
    ],
    sterilization_protocol: 'Run automatic 10% bleach prime cycle post-sample, followed by DI water flush for 10 mins.'
  },

  'EQ-035': {
    operating_steps: [
      'Inspect glass burette stopcock for smooth rotation and leak-tight seal.',
      'Rinse burette with small volume of titrant solution prior to filling.',
      'Fill burette with standard titrant (e.g. 0.1M NaOH) up to zero mark using funnel.',
      'Purge air bubbles from lower tip nozzle valve.',
      'Slowly add titrant dropwise into Erlenmeyer flask until pH indicator endpoint changes color.'
    ],
    safety_warnings: [
      'Wear chemical splash goggles and rubber apron when handling strong acid/base titrants.',
      'Clamp glass burette securely to metal stand to prevent tipping.',
      'Clean chemical drips from bench immediately.'
    ],
    sterilization_protocol: 'Drain remaining titrant into waste bottle. Rinse burette 5x with deionized water and store inverted.'
  },

  'EQ-036': {
    operating_steps: [
      'Deposit 1µL analyte solution mixed with HCCA/DHB matrix onto stainless target plate.',
      'Allow matrix-sample co-crystallization to dry under ambient conditions.',
      'Insert target plate into MS vacuum load lock chamber.',
      'Fire 337nm Nitrogen laser pulses (200 Hz) to desorb and ionize sample molecules.',
      'Record time-of-flight mass spectrum for peptide/protein identification.'
    ],
    safety_warnings: [
      'UV LASER RADIATION HAZARD! Never bypass interlocks on laser enclosure.',
      'High accelerating potential (20kV) inside flight tube.',
      'Handle steel matrix target plates with lint-free gloves to prevent oil contamination.'
    ],
    sterilization_protocol: 'Clean stainless steel target plates with acetone, sonicate in methanol for 15 mins, and dry under Nitrogen gas.'
  },

  'EQ-037': {
    operating_steps: [
      'Place active anhydrous silica gel desiccant beads into lower tray reservoir.',
      'Place moisture-sensitive chemical samples onto perforated ceramic plate.',
      'Apply thin film of vacuum grease to glass ground flange rim.',
      'Close heavy dome lid and connect vacuum hose to stopcock valve.',
      'Evacuate chamber to low pressure using vacuum pump and close stopcock valve.'
    ],
    safety_warnings: [
      'HIGH VACUUM IMPLOSION RISK! Inspect heavy glass dome for chips or cracks.',
      'Store behind protective acrylic safety shield when under deep vacuum.',
      'Release vacuum slowly before attempting to open lid.'
    ],
    sterilization_protocol: 'Wipe ground glass joint flange with acetone to remove old grease. Recharge silica desiccant at 120°C in drying oven.'
  },

  'EQ-038': {
    operating_steps: [
      'Connect 4-terminal Kelvin fixture leads to LCR meter front panel.',
      'Perform OPEN and SHORT circuit compensation calibration at target test frequency.',
      'Clamp test component (Inductor, Capacitor, or Resistor) into Kelvin test clips.',
      'Select measurement test frequency (100 Hz to 1 MHz) and AC drive signal level (1.0V).',
      'Record primary parameter (L, C, R) and secondary quality factor (Q, D, ESR).'
    ],
    safety_warnings: [
      'Discharge high-voltage capacitors completely before connecting to LCR meter inputs!',
      'Do not apply external DC voltage bias exceeding rated instrument specs.',
      'Wear ESD wrist strap when measuring sensitive surface-mount components.'
    ],
    sterilization_protocol: 'Wipe Kelvin clip jaws with isopropyl alcohol swab to ensure low contact resistance.'
  },

  'EQ-039': {
    operating_steps: [
      'Inspect 24-place micro-rotor and sealing lid for damage.',
      'Load 1.5mL / 2.0mL micro-centrifuge tubes symmetrically by mass.',
      'Snap rotor lid shut.',
      'Set speed (up to 14,800 RPM / 21,100 x g) and timer (e.g. 5 mins).',
      'Press START and wait for electronic braking to complete.'
    ],
    safety_warnings: [
      'Never run microcentrifuge without securing the rotor lid.',
      'Ensure sample tubes are rated for high g-force (>20,000 x g) to prevent tube rupture.',
      'Balance tubes within 0.01g difference.'
    ],
    sterilization_protocol: 'Wipe rotor and spin chamber with 70% Ethanol. Autoclave rotor at 121°C for 20 mins if sample leak occurs.'
  },

  'EQ-040': {
    operating_steps: [
      'Cast 1% agarose gel in casting tray with well comb inserted.',
      'Submerge gel into horizontal tank filled with 1x TAE or TBE running buffer.',
      'Load DNA samples mixed with 6x loading dye into wells using micropipette.',
      'Attach safety lid ensuring red cable connects to (+) anode and black to (-) cathode.',
      'Set power supply to 100V constant voltage and initiate electrophoresis run.'
    ],
    safety_warnings: [
      'ELECTROCUTION RISK! Always turn off power supply before opening safety lid.',
      'Ethidium Bromide mutagen hazard! Wear nitrile gloves when handling stained gels.',
      'Do not spill buffer solution onto power supply housing.'
    ],
    sterilization_protocol: 'Rinse gel tank and comb with deionized water post-run. Wipe down tank with 70% Ethanol wipes.'
  },

  'EQ-041': {
    operating_steps: [
      'Clean sapphire prism surface with soft lens tissue and deionized water.',
      'Place 2-3 drops of liquid sample (e.g. sugar syrup, oil, or chemical solution) onto prism.',
      'Close sample cover flap plate.',
      'Press READ button on digital refractometer display.',
      'Record Refractive Index (nD) and temperature-compensated Brix percentage.'
    ],
    safety_warnings: [
      'Do not use metal spatulas or hard objects that scratch the optical prism surface.',
      'Wear safety glasses when testing corrosive or volatile chemical solvents.',
      'Avoid pressing sample cover plate forcefully.'
    ],
    sterilization_protocol: 'Clean prism surface immediately post-sample using DI water and Isopropanol lens wipes.'
  },

  'EQ-042': {
    operating_steps: [
      'Connect RF antenna or coaxial cable to N-type 50Ω input connector.',
      'Set Center Frequency (e.g. 2.4 GHz) and Frequency Span (e.g. 100 MHz).',
      'Adjust Resolution Bandwidth (RBW) and Video Bandwidth (VBW) filters.',
      'Set Reference Level to accommodate peak signal amplitude without receiver overload.',
      'Engage Peak Search marker to measure carrier frequency and power (dBm).'
    ],
    safety_warnings: [
      'Do not exceed maximum continuous RF input power limit (+30 dBm / 1 Watt)!',
      'Ensure DC blocking capacitor is used when probing powered DC circuits.',
      'Do not apply high static discharge to RF input connector.'
    ],
    sterilization_protocol: 'Wipe front panel display and chassis with anti-static electronics cleaning cloth.'
  },

  'EQ-043': {
    operating_steps: [
      'Place solid sample material inside cellulose extraction thimble.',
      'Insert thimble into main Soxhlet glass extraction chamber.',
      'Fill lower round-bottom flask with organic solvent (e.g. Hexane or Ethanol) and stir bar.',
      'Attach water-cooled reflux condenser to top joint.',
      'Heat flask to boil solvent; monitor automatic siphon reflux cycles (10-15 cycles).'
    ],
    safety_warnings: [
      'FIRE & TOXIC VAPOR HAZARD! Perform Soxhlet extraction inside an active fume hood.',
      'Ensure cooling water is continuously circulating through condenser coil.',
      'Never heat dry extraction flask.'
    ],
    sterilization_protocol: 'Clean all glass components with acetone post-extraction and rinse thoroughly with deionized water.'
  },

  'EQ-044': {
    operating_steps: [
      'Turn on microplate reader and initialize optical halogen/LED excitation lamps.',
      'Select excitation wavelength (e.g. 485nm) and emission wavelength (e.g. 535nm).',
      'Load 96-well or 384-well black microplate onto automated plate carrier tray.',
      'Set PMT gain sensitivity and orbital plate shaking duration.',
      'Press READ PLATE and export fluorescence intensity dataset.'
    ],
    safety_warnings: [
      'Do not obstruct automated plate carrier tray movement.',
      'Keep fluorescent samples protected from ambient light to prevent photobleaching.',
      'Avoid liquid droplets on bottom of microplate.'
    ],
    sterilization_protocol: 'Wipe plate carrier tray with 70% Ethanol wipes. Clean optical glass windows with lens tissue.'
  },

  'EQ-045': {
    operating_steps: [
      'Attach stainless steel rotor-stator generator probe to high-speed motor drive.',
      'Submerge probe tip into sample tube containing tissue sample and lysis buffer.',
      'Turn speed control dial to setting 1 (low RPM) and gradually increase to target speed.',
      'Homogenize tissue sample for 15-30 seconds until completely disrupted.',
      'Turn off motor before withdrawing probe from liquid.'
    ],
    safety_warnings: [
      'HIGH-SPEED ROTATING BLADE HAZARD! Never operate probe in air without liquid submergence.',
      'Wear safety goggles, face shield, and gloves to protect against aerosol splash.',
      'Hold sample tube firmly during homogenization.'
    ],
    sterilization_protocol: 'Rinse probe in 70% Ethanol while running at low speed, sonicate probe in detergent bath, and autoclave probe shaft.'
  },

  'EQ-046': {
    operating_steps: [
      'Set desoldering iron tip temperature setpoint (380°C - 420°C).',
      'Allow internal vacuum pump to reach full vacuum pressure.',
      'Place hollow desoldering tip nozzle over PCB component lead pin.',
      'Melt solder joint completely while gently oscillating tip.',
      'Depress vacuum trigger button to pull molten solder into internal collector tube.'
    ],
    safety_warnings: [
      'Hot tip (420°C) — severe burn hazard! Use under active fume extraction hood.',
      'Empty solder collector glass tube regularly to prevent vacuum clogging.',
      'Wear eye protection when desoldering.'
    ],
    sterilization_protocol: 'Clear nozzle orifice with cleaning pin while hot. Empty solder glass collection tube post-use.'
  },

  'EQ-047': {
    operating_steps: [
      'Inspect glass separatory funnel body and PTFE stopcock valve for leaks.',
      'Pour immiscible biphasic mixture (e.g. aqueous phase & organic solvent) into funnel.',
      'Insert ground glass stopper firmly into neck.',
      'Invert funnel and immediately open stopcock valve away from face to vent gas pressure.',
      'Shake gently, vent again, place in ring stand, and allow phases to separate cleanly.'
    ],
    safety_warnings: [
      'HIGH VAPOR PRESSURE HAZARD! Vent gas pressure repeatedly when shaking volatile solvents.',
      'Point funnel stem AWAY from yourself and lab colleagues when venting!',
      'Wear chemical splash apron and safety goggles.'
    ],
    sterilization_protocol: 'Drain lower and upper layers into separate waste flasks. Wash funnel with detergent, rinse 3x with water, and dry.'
  },

  'EQ-048': {
    operating_steps: [
      'Clean glass polarimeter sample tube optical windows with lens paper.',
      'Fill 100mm sample tube with optically active sample solution (e.g. D-Glucose).',
      'Ensure zero air bubbles are trapped in optical light path.',
      'Place sample tube into temperature-controlled polarimeter chamber.',
      'Measure optical rotation angle [α] at Sodium D-line (589.3nm).'
    ],
    safety_warnings: [
      'Do not over-tighten sample tube end caps (distorts glass optical windows and creates stress birefringence).',
      'Wear safety glasses when handling chiral chemical solutions.',
      'Avoid liquid leaks inside sample compartment.'
    ],
    sterilization_protocol: 'Rinse sample tube thoroughly with deionized water and ethanol. Clean optical end glass windows with lens tissue.'
  },

  'EQ-049': {
    operating_steps: [
      'Fill outer water jacket reservoir with sterile deionized water.',
      'Set digital temperature controller to 37.0°C and CO2 setpoint to 5.0%.',
      'Place sterile copper humidity pan on bottom shelf.',
      'Load mammalian cell culture flasks onto copper/stainless steel shelves.',
      'Close inner glass door seal, then main outer door.'
    ],
    safety_warnings: [
      'Verify CO2 gas cylinder pressure regulator to prevent chamber hypoxia.',
      'Wear lab coat and nitrile gloves to maintain aseptic cell culture conditions.',
      'Avoid touching water jacket drain valves.'
    ],
    sterilization_protocol: 'Perform automated 180°C high-heat sterilization cycle monthly. Autoclave removable copper shelves.'
  },

  'EQ-050': {
    operating_steps: [
      'Connect test leads to semiconductor device terminals (Collector/Drain, Base/Gate, Emitter/Source).',
      'Set Peak Power Limiting Resistor (e.g. 100Ω) to prevent device thermal breakdown.',
      'Set Collector/Drain Sweep Voltage range (0 - 50V) and Step Generator current/voltage.',
      'Enable sweep output and observe I-V characteristic curve family on CRT/LCD screen.',
      'Measure breakdown voltage (Vbr), threshold voltage (Vth), and transconductance (gm).'
    ],
    safety_warnings: [
      'HIGH VOLTAGE / HIGH CURRENT HAZARDS! Collector sweep can reach >500V.',
      'Do not touch exposed test fixture terminals during active sweep.',
      'Verify power dissipation limits of semiconductor device under test.'
    ],
    sterilization_protocol: 'Wipe test fixture chassis and rotary switches with dry anti-static microfiber cloth.'
  }
};


/**
 * Fallback template for any custom or newly added equipment
 */
const DEFAULT_INSTRUCTIONS = {
  operating_steps: [
    'Inspect equipment for visible physical damage or loose electrical connections prior to use.',
    'Verify power supply voltage matches equipment specification plate.',
    'Follow standard laboratory operating procedure for sample preparation and loading.',
    'Monitor equipment during operation and record experiment data in lab notebook.',
    'Turn off power switch and return equipment to designated lab storage location post-use.'
  ],
  safety_warnings: [
    'Wear required Personal Protective Equipment (PPE): lab coat, safety glasses, and nitrile gloves.',
    'Report any unusual noise, smoke, or erratic readings immediately to lab manager.',
    'Do not operate equipment outside specified temperature and electrical ratings.'
  ],
  sterilization_protocol: 'Clean external housing surfaces with 70% Isopropanol wipes after every sample session.'
};

export function getEquipmentInstructions(equipmentId, equipmentName = '') {
  if (INSTRUCTIONS_DATABASE[equipmentId]) {
    return INSTRUCTIONS_DATABASE[equipmentId];
  }
  return DEFAULT_INSTRUCTIONS;
}
