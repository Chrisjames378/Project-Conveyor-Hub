import { LocationIntel, WeatherPattern3DData, PollutionReportData } from '../types';

// Pre-configured World & Oceania Observatories
export const PRESET_OBSERVATORIES: LocationIntel[] = [
  {
    id: 'baring-head-nz',
    name: 'Baring Head Clean Air Station',
    subtitle: 'Wellington Headland, NZ • NIWA & Scripps CO2 Baseline',
    category: 'Atmospheric Baseline',
    lat: -41.408,
    lng: 174.871,
    elevationM: 85,
    nearestBasin: 'Cook Strait / Southern Ocean Marine Boundary',
    weather: {
      temperatureC: 13.4,
      temperatureF: 56.1,
      feelsLikeC: 10.2,
      pressureHpa: 1018.6,
      pressureTendency: 'Rising',
      windSpeedKnots: 28.5,
      windSpeedMs: 14.7,
      windDirectionDeg: 195,
      windDirectionCompass: 'SSW',
      windGustKnots: 36.0,
      cloudCoverPct: 45,
      cloudCeilingM: 1450,
      cloudType: 'Stratocumulus Maritime Bands',
      humidityPct: 76,
      dewPointC: 9.1,
      precipRateMmH: 0.0,
      precipType: 'None',
      frontalSystem: 'Marine Boundary Layer',
      jetStreamSpeedKnots: 85,
      uvIndex: 4,
      forecastSummary: 'Pristine southerly maritime airflow sweeping directly off the Southern Ocean.'
    },
    pollution: {
      co2: {
        ppm: 422.4,
        baselinePpm: 422.1,
        deltaPpm: 0.3,
        status: 'Baseline Clean',
        oceanAtmosphereFluxMmolM2Day: -18.2,
        salibuoySinkOffsetTonnesDay: 142.5,
        attribution: {
          fossilFuelPct: 8,
          transportPct: 12,
          marineDegassingPct: 5,
          naturalVegetationPct: 75
        },
        trend24h: -0.15,
        keelingDiscrepancy: 'Scripps Southern Baseline Track Verified (Within 0.05% of Cape Grim)'
      },
      methane: {
        ppb: 1908,
        baselinePpb: 1905,
        deltaPpb: 3,
        status: 'Normal Baseline',
        subseaHydrateStabilityPct: 98.4,
        gwp20ImpactFactor: 84,
        attribution: {
          subseaClathratePct: 6,
          agriculturalEntericPct: 32,
          wetlandBiogenicPct: 48,
          fugitiveFossilPct: 14
        },
        acousticBubbleFlareDetected: false,
        marineOHOxidationRatePpbDay: 0.58,
        plumeRiskDescription: 'Lowest anthropogenic methane signature in Oceania. Ideal baseline for Southern Ocean cryo-flux.'
      },
      aqi: 14,
      aqiCategory: 'Good (Pristine Marine)',
      pm25: 2.1,
      pm10: 5.4,
      troposphericOzonePpb: 18.2,
      nitrousOxidePpb: 336.1,
      overallAirQualitySummary: 'World-standard clean maritime air parcel; unadulterated baseline composition.'
    }
  },
  {
    id: 'pukekohe-salibuoy-base',
    name: 'Pukekohe SaliBuoy Engineering Base',
    subtitle: 'Auckland South, NZ • Outset DeepTech Facility',
    category: 'SaliBuoy Engineering',
    lat: -37.201,
    lng: 174.908,
    elevationM: 82,
    nearestBasin: 'Manukau Harbour / Tasman Coastal Approach',
    weather: {
      temperatureC: 17.8,
      temperatureF: 64.0,
      feelsLikeC: 17.2,
      pressureHpa: 1016.2,
      pressureTendency: 'Steady',
      windSpeedKnots: 14.2,
      windSpeedMs: 7.3,
      windDirectionDeg: 245,
      windDirectionCompass: 'WSW',
      windGustKnots: 21.0,
      cloudCoverPct: 38,
      cloudCeilingM: 1800,
      cloudType: 'Cumulus Mediocris',
      humidityPct: 68,
      dewPointC: 11.6,
      precipRateMmH: 0.0,
      precipType: 'None',
      frontalSystem: 'Subtropical Ridge',
      jetStreamSpeedKnots: 62,
      uvIndex: 6,
      forecastSummary: 'Moderate westerly flow with mild onshore sea breeze ideal for telemetry testing.'
    },
    pollution: {
      co2: {
        ppm: 434.6,
        baselinePpm: 423.0,
        deltaPpm: 11.6,
        status: 'Mild Elevation',
        oceanAtmosphereFluxMmolM2Day: -8.4,
        salibuoySinkOffsetTonnesDay: 210.0,
        attribution: {
          fossilFuelPct: 44,
          transportPct: 36,
          marineDegassingPct: 4,
          naturalVegetationPct: 16
        },
        trend24h: 1.2,
        keelingDiscrepancy: 'Urban/Agri-corridor daytime carbon accumulation from SH1 motorway and horticultures'
      },
      methane: {
        ppb: 2045,
        baselinePpb: 1910,
        deltaPpb: 135,
        status: 'Agricultural Hotspot',
        subseaHydrateStabilityPct: 99.1,
        gwp20ImpactFactor: 84,
        attribution: {
          subseaClathratePct: 2,
          agriculturalEntericPct: 68,
          wetlandBiogenicPct: 22,
          fugitiveFossilPct: 8
        },
        acousticBubbleFlareDetected: false,
        marineOHOxidationRatePpbDay: 0.62,
        plumeRiskDescription: 'Waikato agricultural dairy belt plume. Typical biogenic enteric fermentation emissions.'
      },
      aqi: 28,
      aqiCategory: 'Good (Pristine Marine)',
      pm25: 6.8,
      pm10: 12.3,
      troposphericOzonePpb: 24.6,
      nitrousOxidePpb: 338.4,
      overallAirQualitySummary: 'Clean ambient peri-urban air with mild agricultural methane enrichment.'
    }
  },
  {
    id: 'hikurangi-methane-seep',
    name: 'Hikurangi Trench Subsea Methane Seep',
    subtitle: 'Offshore Gisborne / East Coast NZ • Gas Hydrate Clathrate Field',
    category: 'Subsea Methane Hydrate',
    lat: -40.150,
    lng: 177.300,
    elevationM: -1850,
    nearestBasin: 'Hikurangi Subsea Trough (South Pacific Trench)',
    weather: {
      temperatureC: 15.2,
      temperatureF: 59.4,
      feelsLikeC: 13.8,
      pressureHpa: 1014.0,
      pressureTendency: 'Falling',
      windSpeedKnots: 22.0,
      windSpeedMs: 11.3,
      windDirectionDeg: 160,
      windDirectionCompass: 'SSE',
      windGustKnots: 31.5,
      cloudCoverPct: 62,
      cloudCeilingM: 1100,
      cloudType: 'Altostratus Undulatus',
      humidityPct: 82,
      dewPointC: 12.1,
      precipRateMmH: 1.2,
      precipType: 'Light Rain',
      frontalSystem: 'Cold Front',
      jetStreamSpeedKnots: 92,
      uvIndex: 3,
      forecastSummary: 'Southeasterly oceanic swell pushing across tectonic subsea margin with surface squalls.'
    },
    pollution: {
      co2: {
        ppm: 423.8,
        baselinePpm: 422.5,
        deltaPpm: 1.3,
        status: 'Baseline Clean',
        oceanAtmosphereFluxMmolM2Day: -15.4,
        salibuoySinkOffsetTonnesDay: 380.0,
        attribution: {
          fossilFuelPct: 6,
          transportPct: 8,
          marineDegassingPct: 22,
          naturalVegetationPct: 64
        },
        trend24h: -0.4,
        keelingDiscrepancy: 'Active ocean uptake zone; minor degassing from tectonic cold seeps'
      },
      methane: {
        ppb: 2380,
        baselinePpb: 1912,
        deltaPpb: 468,
        status: 'Plume Warning',
        subseaHydrateStabilityPct: 82.5,
        gwp20ImpactFactor: 84,
        attribution: {
          subseaClathratePct: 76,
          agriculturalEntericPct: 8,
          wetlandBiogenicPct: 10,
          fugitiveFossilPct: 6
        },
        acousticBubbleFlareDetected: true,
        marineOHOxidationRatePpbDay: 1.45,
        plumeRiskDescription: 'Acoustic flare active! Subsea gas flares rising 400m through water column from clathrate vents.'
      },
      aqi: 32,
      aqiCategory: 'Good (Pristine Marine)',
      pm25: 4.2,
      pm10: 9.8,
      troposphericOzonePpb: 19.4,
      nitrousOxidePpb: 335.8,
      overallAirQualitySummary: 'Maritime air enriched with subsea natural methane flares; monitored by SaliBuoy acoustic array.'
    }
  },
  {
    id: 'hauraki-gulf-ocean-boy',
    name: 'Hauraki Gulf Marine Array (Ocean Boy Beta 2)',
    subtitle: 'Great Barrier Island Offshore, NZ • SaliBuoy Fleet #2',
    category: 'Marine Observatory',
    lat: -36.520,
    lng: 175.250,
    elevationM: 0,
    nearestBasin: 'Hauraki Gulf Marine Park / Outer Shelf',
    weather: {
      temperatureC: 18.6,
      temperatureF: 65.5,
      feelsLikeC: 18.0,
      pressureHpa: 1017.5,
      pressureTendency: 'Steady',
      windSpeedKnots: 16.8,
      windSpeedMs: 8.6,
      windDirectionDeg: 210,
      windDirectionCompass: 'SSW',
      windGustKnots: 22.4,
      cloudCoverPct: 25,
      cloudCeilingM: 2200,
      cloudType: 'Cirrus Spissatus',
      humidityPct: 72,
      dewPointC: 13.2,
      precipRateMmH: 0.0,
      precipType: 'None',
      frontalSystem: 'Subtropical Ridge',
      jetStreamSpeedKnots: 55,
      uvIndex: 7,
      forecastSummary: 'Clear sky, high solar irradiance feeding buoy photovoltaic arrays; moderate wave power 2.4 kW.'
    },
    pollution: {
      co2: {
        ppm: 418.5,
        baselinePpm: 423.0,
        deltaPpm: -4.5,
        status: 'Marine Sink Active',
        oceanAtmosphereFluxMmolM2Day: -24.8,
        salibuoySinkOffsetTonnesDay: 512.0,
        attribution: {
          fossilFuelPct: 15,
          transportPct: 18,
          marineDegassingPct: 2,
          naturalVegetationPct: 65
        },
        trend24h: -1.8,
        keelingDiscrepancy: 'Strong negative CO2 anomaly: SaliBuoy hyper-saline downwelling actively pulling dissolved inorganic carbon to depth.'
      },
      methane: {
        ppb: 1935,
        baselinePpb: 1910,
        deltaPpb: 25,
        status: 'Normal Baseline',
        subseaHydrateStabilityPct: 97.8,
        gwp20ImpactFactor: 84,
        attribution: {
          subseaClathratePct: 8,
          agriculturalEntericPct: 42,
          wetlandBiogenicPct: 35,
          fugitiveFossilPct: 15
        },
        acousticBubbleFlareDetected: false,
        marineOHOxidationRatePpbDay: 0.74,
        plumeRiskDescription: 'Standard coastal background with high oceanic OH radical oxidation.'
      },
      aqi: 18,
      aqiCategory: 'Good (Pristine Marine)',
      pm25: 3.5,
      pm10: 7.2,
      troposphericOzonePpb: 22.1,
      nitrousOxidePpb: 336.5,
      overallAirQualitySummary: 'High-salinity downwelling plume driving active atmospheric carbon drawdown.'
    }
  },
  {
    id: 'mauna-loa-noaa',
    name: 'Mauna Loa Observatory',
    subtitle: 'Hawaii, USA • NOAA Global Greenhouse Gas Baseline',
    category: 'Atmospheric Baseline',
    lat: 19.536,
    lng: -155.576,
    elevationM: 3397,
    nearestBasin: 'North Central Pacific Free Troposphere',
    weather: {
      temperatureC: 8.5,
      temperatureF: 47.3,
      feelsLikeC: 6.2,
      pressureHpa: 682.0,
      pressureTendency: 'Steady',
      windSpeedKnots: 11.5,
      windSpeedMs: 5.9,
      windDirectionDeg: 80,
      windDirectionCompass: 'ENE',
      windGustKnots: 17.0,
      cloudCoverPct: 10,
      cloudCeilingM: 4500,
      cloudType: 'Clear Stratosphere Boundary',
      humidityPct: 24,
      dewPointC: -12.4,
      precipRateMmH: 0.0,
      precipType: 'None',
      frontalSystem: 'Subtropical Ridge',
      jetStreamSpeedKnots: 40,
      uvIndex: 9,
      forecastSummary: 'Crisp mountain air above marine trade wind inversion layer; global benchmark clarity.'
    },
    pollution: {
      co2: {
        ppm: 426.8,
        baselinePpm: 426.5,
        deltaPpm: 0.3,
        status: 'Baseline Clean',
        oceanAtmosphereFluxMmolM2Day: -2.1,
        salibuoySinkOffsetTonnesDay: 0.0,
        attribution: {
          fossilFuelPct: 88,
          transportPct: 5,
          marineDegassingPct: 2,
          naturalVegetationPct: 5
        },
        trend24h: 0.08,
        keelingDiscrepancy: 'Official NOAA Scripps Keeling Curve benchmark point (March 2026 Seasonality: Early spring peak).'
      },
      methane: {
        ppb: 1938,
        baselinePpb: 1935,
        deltaPpb: 3,
        status: 'Normal Baseline',
        subseaHydrateStabilityPct: 99.9,
        gwp20ImpactFactor: 84,
        attribution: {
          subseaClathratePct: 2,
          agriculturalEntericPct: 38,
          wetlandBiogenicPct: 42,
          fugitiveFossilPct: 18
        },
        acousticBubbleFlareDetected: false,
        marineOHOxidationRatePpbDay: 0.52,
        plumeRiskDescription: 'Standard Northern Hemisphere baseline showing northern summer/winter oscillation.'
      },
      aqi: 9,
      aqiCategory: 'Good (Pristine Marine)',
      pm25: 1.2,
      pm10: 2.8,
      troposphericOzonePpb: 38.5,
      nitrousOxidePpb: 337.2,
      overallAirQualitySummary: 'Free tropospheric standard reference air parcel; pristine global Keeling benchmark.'
    }
  },
  {
    id: 'cape-grim-tasmania',
    name: 'Cape Grim Baseline Air Pollution Station',
    subtitle: 'Tasmania, Australia • CSIRO & BoM Baseline',
    category: 'Atmospheric Baseline',
    lat: -40.683,
    lng: 144.690,
    elevationM: 94,
    nearestBasin: 'Roaring Forties / Southern Ocean Airway',
    weather: {
      temperatureC: 14.1,
      temperatureF: 57.4,
      feelsLikeC: 11.0,
      pressureHpa: 1012.8,
      pressureTendency: 'Falling',
      windSpeedKnots: 34.0,
      windSpeedMs: 17.5,
      windDirectionDeg: 260,
      windDirectionCompass: 'W',
      windGustKnots: 46.0,
      cloudCoverPct: 78,
      cloudCeilingM: 900,
      cloudType: 'Cumulonimbus Marine Showers',
      humidityPct: 85,
      dewPointC: 11.5,
      precipRateMmH: 2.4,
      precipType: 'Squall',
      frontalSystem: 'Cold Front',
      jetStreamSpeedKnots: 110,
      uvIndex: 3,
      forecastSummary: 'Gale-force Westerly gale roaring in off 10,000 km of open Southern Ocean.'
    },
    pollution: {
      co2: {
        ppm: 421.9,
        baselinePpm: 421.8,
        deltaPpm: 0.1,
        status: 'Baseline Clean',
        oceanAtmosphereFluxMmolM2Day: -22.4,
        salibuoySinkOffsetTonnesDay: 280.0,
        attribution: {
          fossilFuelPct: 4,
          transportPct: 6,
          marineDegassingPct: 5,
          naturalVegetationPct: 85
        },
        trend24h: -0.22,
        keelingDiscrepancy: 'Clean sector baseline verification: air unpolluted by land masses for 3 weeks of transport.'
      },
      methane: {
        ppb: 1904,
        baselinePpb: 1902,
        deltaPpb: 2,
        status: 'Normal Baseline',
        subseaHydrateStabilityPct: 99.5,
        gwp20ImpactFactor: 84,
        attribution: {
          subseaClathratePct: 4,
          agriculturalEntericPct: 26,
          wetlandBiogenicPct: 55,
          fugitiveFossilPct: 15
        },
        acousticBubbleFlareDetected: false,
        marineOHOxidationRatePpbDay: 0.65,
        plumeRiskDescription: 'Lowest methane baseline in Australian quadrant; benchmark for atmospheric chemistry models.'
      },
      aqi: 11,
      aqiCategory: 'Good (Pristine Marine)',
      pm25: 1.8,
      pm10: 6.2,
      troposphericOzonePpb: 16.8,
      nitrousOxidePpb: 335.7,
      overallAirQualitySummary: 'Pure Roaring Forties air with sea-salt aerosols and baseline gas concentrations.'
    }
  },
  {
    id: 'southern-ocean-alpha1',
    name: 'Southern Ocean Polar Front (Ocean Boy Alpha 1)',
    subtitle: 'Latitude 54°S • Antarctic Circumpolar Current',
    category: 'Polar Station',
    lat: -54.280,
    lng: 158.950,
    elevationM: 0,
    nearestBasin: 'Macquarie Ridge / Sub-Antarctic Front',
    weather: {
      temperatureC: 4.8,
      temperatureF: 40.6,
      feelsLikeC: -1.5,
      pressureHpa: 986.4,
      pressureTendency: 'Falling',
      windSpeedKnots: 44.5,
      windSpeedMs: 22.9,
      windDirectionDeg: 285,
      windDirectionCompass: 'WNW',
      windGustKnots: 58.0,
      cloudCoverPct: 95,
      cloudCeilingM: 450,
      cloudType: 'Nimbostratus Polar Gale',
      humidityPct: 91,
      dewPointC: 3.4,
      precipRateMmH: 4.8,
      precipType: 'Squall',
      frontalSystem: 'Polar Low',
      jetStreamSpeedKnots: 135,
      uvIndex: 1,
      forecastSummary: 'Severe Furious Fifties polar low passing; 6.2m swells delivering 8.4 kW wave energy per buoy.'
    },
    pollution: {
      co2: {
        ppm: 416.2,
        baselinePpm: 421.5,
        deltaPpm: -5.3,
        status: 'Marine Sink Active',
        oceanAtmosphereFluxMmolM2Day: -38.6,
        salibuoySinkOffsetTonnesDay: 840.0,
        attribution: {
          fossilFuelPct: 2,
          transportPct: 3,
          marineDegassingPct: 1,
          naturalVegetationPct: 94
        },
        trend24h: -1.4,
        keelingDiscrepancy: 'Massive atmospheric carbon drawdown driven by cold saline water subduction into Antarctic Intermediate Water.'
      },
      methane: {
        ppb: 1888,
        baselinePpb: 1895,
        deltaPpb: -7,
        status: 'Normal Baseline',
        subseaHydrateStabilityPct: 99.8,
        gwp20ImpactFactor: 84,
        attribution: {
          subseaClathratePct: 2,
          agriculturalEntericPct: 15,
          wetlandBiogenicPct: 70,
          fugitiveFossilPct: 13
        },
        acousticBubbleFlareDetected: false,
        marineOHOxidationRatePpbDay: 0.42,
        plumeRiskDescription: 'Deep polar low background. Near-zero local emission sources; maximal global sink activity.'
      },
      aqi: 6,
      aqiCategory: 'Good (Pristine Marine)',
      pm25: 0.9,
      pm10: 4.1,
      troposphericOzonePpb: 12.4,
      nitrousOxidePpb: 334.8,
      overallAirQualitySummary: 'Ultra-pure polar air parcel with intense biological and physical carbon sequestration.'
    }
  },
  {
    id: 'white-island-plume',
    name: 'Whakaari / White Island Marine Volcanic Plume',
    subtitle: 'Bay of Plenty, NZ • Active Marine Degassing',
    category: 'Marine Observatory',
    lat: -37.520,
    lng: 177.180,
    elevationM: 321,
    nearestBasin: 'Taupo Volcanic Zone / Havre Trough Extension',
    weather: {
      temperatureC: 19.4,
      temperatureF: 66.9,
      feelsLikeC: 19.4,
      pressureHpa: 1015.0,
      pressureTendency: 'Steady',
      windSpeedKnots: 12.0,
      windSpeedMs: 6.2,
      windDirectionDeg: 300,
      windDirectionCompass: 'WNW',
      windGustKnots: 18.0,
      cloudCoverPct: 40,
      cloudCeilingM: 1600,
      cloudType: 'Volcanic Fumarolic Steam Plume',
      humidityPct: 70,
      dewPointC: 13.8,
      precipRateMmH: 0.0,
      precipType: 'None',
      frontalSystem: 'Subtropical Ridge',
      jetStreamSpeedKnots: 68,
      uvIndex: 6,
      forecastSummary: 'Marine boundary flow dispersing fumarole steam and acid gases eastward into the Pacific.'
    },
    pollution: {
      co2: {
        ppm: 448.2,
        baselinePpm: 423.0,
        deltaPpm: 25.2,
        status: 'High Plume',
        oceanAtmosphereFluxMmolM2Day: 48.0,
        salibuoySinkOffsetTonnesDay: 180.0,
        attribution: {
          fossilFuelPct: 4,
          transportPct: 6,
          marineDegassingPct: 78,
          naturalVegetationPct: 12
        },
        trend24h: 4.6,
        keelingDiscrepancy: 'Natural volcanic and geothermal CO2 venting from submerged caldera and crater lake fumaroles.'
      },
      methane: {
        ppb: 2190,
        baselinePpb: 1910,
        deltaPpb: 280,
        status: 'Elevated Seep',
        subseaHydrateStabilityPct: 89.2,
        gwp20ImpactFactor: 84,
        attribution: {
          subseaClathratePct: 58,
          agriculturalEntericPct: 14,
          wetlandBiogenicPct: 18,
          fugitiveFossilPct: 10
        },
        acousticBubbleFlareDetected: true,
        marineOHOxidationRatePpbDay: 1.15,
        plumeRiskDescription: 'Hydrothermal methane degassing mixed with SO2 and volcanic steam. Monitored for magmatic pressure shifts.'
      },
      aqi: 58,
      aqiCategory: 'Moderate',
      pm25: 14.5,
      pm10: 28.0,
      troposphericOzonePpb: 29.4,
      nitrousOxidePpb: 337.0,
      overallAirQualitySummary: 'Localized natural volcanic enrichment of CO2, SO2, and geothermal methane plumes.'
    }
  },
  {
    id: 'ross-sea-mcmurdo',
    name: 'Ross Sea & McMurdo Sound Base',
    subtitle: 'Ross Ice Shelf, Antarctica • Polar Bottom Water Formation',
    category: 'Polar Station',
    lat: -77.846,
    lng: 166.668,
    elevationM: 24,
    nearestBasin: 'Ross Sea Continental Shelf / Antarctic Bottom Water',
    weather: {
      temperatureC: -16.4,
      temperatureF: 2.5,
      feelsLikeC: -28.2,
      pressureHpa: 978.2,
      pressureTendency: 'Falling',
      windSpeedKnots: 36.8,
      windSpeedMs: 18.9,
      windDirectionDeg: 135,
      windDirectionCompass: 'SE',
      windGustKnots: 52.0,
      cloudCoverPct: 88,
      cloudCeilingM: 600,
      cloudType: 'Polar Katabatic Blizzard Stratus',
      humidityPct: 82,
      dewPointC: -18.6,
      precipRateMmH: 1.8,
      precipType: 'Sleet',
      frontalSystem: 'Polar Low',
      jetStreamSpeedKnots: 145,
      uvIndex: 0,
      forecastSummary: 'Severe katabatic wind drainage off polar plateau; brash ice formation accelerating.'
    },
    pollution: {
      co2: {
        ppm: 414.8,
        baselinePpm: 420.5,
        deltaPpm: -5.7,
        status: 'Marine Sink Active',
        oceanAtmosphereFluxMmolM2Day: -44.2,
        salibuoySinkOffsetTonnesDay: 960.0,
        attribution: {
          fossilFuelPct: 1,
          transportPct: 2,
          marineDegassingPct: 1,
          naturalVegetationPct: 96
        },
        trend24h: -0.8,
        keelingDiscrepancy: 'Intense cold water thermohaline pump; maximal solubility pump drawdown into bottom water.'
      },
      methane: {
        ppb: 1872,
        baselinePpb: 1880,
        deltaPpb: -8,
        status: 'Normal Baseline',
        subseaHydrateStabilityPct: 99.9,
        gwp20ImpactFactor: 84,
        attribution: {
          subseaClathratePct: 4,
          agriculturalEntericPct: 10,
          wetlandBiogenicPct: 75,
          fugitiveFossilPct: 11
        },
        acousticBubbleFlareDetected: false,
        marineOHOxidationRatePpbDay: 0.28,
        plumeRiskDescription: 'Lowest methane levels measured on planet Earth. Cleanest polar air mass benchmark.'
      },
      aqi: 4,
      aqiCategory: 'Good (Pristine Marine)',
      pm25: 0.4,
      pm10: 1.2,
      troposphericOzonePpb: 10.2,
      nitrousOxidePpb: 334.2,
      overallAirQualitySummary: 'Pristine cryospheric atmosphere with ultra-low particulate and maximal CO2 solubility pump.'
    }
  }
];

// Calculate localized dynamics for any latitude and longitude
export function calculateLocationDynamics(
  lat: number, 
  lng: number, 
  locationName: string = 'Custom Coordinate Pinpoint'
): LocationIntel {
  // Check if near an existing preset (within 0.3 degrees)
  const existing = PRESET_OBSERVATORIES.find(
    p => Math.abs(p.lat - lat) < 0.25 && Math.abs(p.lng - lng) < 0.25
  );
  if (existing) {
    return existing;
  }

  // Latitude physics
  const absLat = Math.abs(lat);
  const isSouthern = lat < 0;
  
  // Base temperature based on latitude
  let baseTemp = 28 - (absLat * 0.55);
  if (absLat > 60) baseTemp = -5 - (absLat - 60) * 0.8;
  const tempC = Number((baseTemp + (Math.sin(lng * 0.1) * 3)).toFixed(1));
  const tempF = Number(((tempC * 9/5) + 32).toFixed(1));

  // Pressure physics: Roaring forties low pressure vs Subtropical high
  let pressure = 1013.25;
  if (absLat > 40 && absLat < 65) {
    pressure = 1002 - Math.sin(absLat) * 12; // deep sub-polar low
  } else if (absLat >= 20 && absLat <= 35) {
    pressure = 1022 - Math.cos(absLat) * 4; // subtropical ridge
  }
  const pressureHpa = Number(pressure.toFixed(1));
  const pressureTendency = pressureHpa < 1008 ? 'Falling' : pressureHpa > 1018 ? 'Rising' : 'Steady';

  // Wind speed & direction based on global circulation cells
  let windSpeedKnots = 12;
  let windDir = 240;
  let windSystem = 'Moderate Westerlies';
  let frontal: 'Subtropical Ridge' | 'Polar Low' | 'Cold Front' | 'Warm Sector' | 'Cyclonic Trough' | 'Marine Boundary Layer' = 'Marine Boundary Layer';

  if (absLat >= 40 && absLat <= 60) {
    windSpeedKnots = Math.round(26 + Math.sin(lng) * 14);
    windDir = 265 + Math.round(Math.cos(lat) * 20);
    windSystem = 'Roaring Forties Gale';
    frontal = 'Cold Front';
  } else if (absLat > 60) {
    windSpeedKnots = Math.round(32 + Math.abs(Math.sin(lng)) * 12);
    windDir = 120 + Math.round(Math.sin(lat) * 30);
    windSystem = 'Polar Katabatic Flow';
    frontal = 'Polar Low';
  } else if (absLat < 25) {
    windSpeedKnots = Math.round(14 + Math.sin(lat) * 6);
    windDir = isSouthern ? 110 : 70;
    windSystem = 'Trade Winds';
    frontal = 'Subtropical Ridge';
  }

  const windSpeedMs = Number((windSpeedKnots * 0.514444).toFixed(1));
  const windGustKnots = Math.round(windSpeedKnots * 1.35);

  // Cloud & precipitation
  const cloudPct = Math.min(95, Math.max(10, Math.round(45 + Math.sin(lat * 2 + lng) * 35)));
  const precipRate = cloudPct > 70 ? Number((1.5 + Math.sin(lng) * 2.5).toFixed(1)) : 0.0;
  const precipType = precipRate > 3 ? 'Squall' : precipRate > 0 ? (tempC < 2 ? 'Sleet' : 'Light Rain') : 'None';

  // CO2 calculation based on latitude, oceanic sink, and anthropogenic zones
  let baseCo2 = 423.5;
  let statusCo2: 'Baseline Clean' | 'Mild Elevation' | 'High Plume' | 'Marine Sink Active' = 'Baseline Clean';
  let co2Flux = -12.4; // ocean sink

  if (absLat > 45) {
    // Southern Ocean / high latitude strong ocean solubility pump
    baseCo2 = 417.8 - (absLat - 45) * 0.2;
    statusCo2 = 'Marine Sink Active';
    co2Flux = -32.5;
  } else if (absLat >= 34 && absLat <= 42 && lng > 170 && lng < 178) {
    // NZ land / coastal zone
    baseCo2 = 428.4;
    statusCo2 = 'Mild Elevation';
    co2Flux = -16.2;
  }

  const co2Ppm = Number(baseCo2.toFixed(1));
  const baselineCo2 = 422.5;
  const deltaCo2 = Number((co2Ppm - baselineCo2).toFixed(1));

  // Methane calculation
  let baseCh4 = 1915;
  let statusCh4: 'Normal Baseline' | 'Elevated Seep' | 'Plume Warning' | 'Agricultural Hotspot' = 'Normal Baseline';
  let acousticFlare = false;
  let clathrateStability = 98.2;

  // Subsea seep margin in Hikurangi / Kermadec trench or Chatham rise
  if (lat >= -44 && lat <= -37 && lng >= 176 && lng <= 179) {
    baseCh4 = 2240;
    statusCh4 = 'Plume Warning';
    acousticFlare = true;
    clathrateStability = 84.5;
  } else if (lat >= -39 && lat <= -36 && lng >= 174 && lng <= 176) {
    // Waikato agricultural belt
    baseCh4 = 2080;
    statusCh4 = 'Agricultural Hotspot';
  } else if (absLat > 55) {
    baseCh4 = 1885;
  }

  const methanePpb = Math.round(baseCh4);
  const baselineCh4 = 1910;
  const deltaCh4 = methanePpb - baselineCh4;

  const aqi = Math.max(5, Math.min(85, Math.round(15 + (co2Ppm - 420) * 0.8 + (methanePpb - 1900) * 0.05)));
  const aqiCategory = aqi < 25 ? 'Good (Pristine Marine)' : aqi < 50 ? 'Moderate' : 'Unhealthy for Sensitive';

  return {
    id: `custom-loc-${lat.toFixed(3)}-${lng.toFixed(3)}`,
    name: locationName,
    subtitle: `Coordinates: ${lat >= 0 ? `${lat.toFixed(3)}°N` : `${Math.abs(lat).toFixed(3)}°S`}, ${lng >= 0 ? `${lng.toFixed(3)}°E` : `${Math.abs(lng).toFixed(3)}°W`}`,
    category: 'Custom / GPS',
    lat: Number(lat.toFixed(3)),
    lng: Number(lng.toFixed(3)),
    elevationM: Math.round(Math.abs(Math.sin(lat + lng)) * 140),
    nearestBasin: isSouthern ? 'South Pacific / Southern Ocean Basin' : 'North Pacific / Atlantic Basin',
    isUserGps: locationName.includes('Current Location') || locationName.includes('GPS'),
    weather: {
      temperatureC: tempC,
      temperatureF: tempF,
      feelsLikeC: Number((tempC - (windSpeedMs * 0.25)).toFixed(1)),
      pressureHpa,
      pressureTendency,
      windSpeedKnots,
      windSpeedMs,
      windDirectionDeg: windDir,
      windDirectionCompass: getCompassHeading(windDir),
      windGustKnots,
      cloudCoverPct: cloudPct,
      cloudCeilingM: Math.round(1200 + Math.sin(lng) * 600),
      cloudType: cloudPct > 70 ? 'Stratocumulus Marine Deck' : 'Scattered Cumulus',
      humidityPct: Math.round(65 + Math.sin(lat) * 20),
      dewPointC: Number((tempC - 4.2).toFixed(1)),
      precipRateMmH: precipRate,
      precipType,
      frontalSystem: frontal,
      jetStreamSpeedKnots: Math.round(60 + absLat * 1.2),
      uvIndex: Math.max(0, Math.round(10 - (absLat / 9))),
      forecastSummary: `${windSystem} with ${windSpeedKnots} knots sustained. Pressure ${pressureHpa} hPa (${pressureTendency}).`
    },
    pollution: {
      co2: {
        ppm: co2Ppm,
        baselinePpm: baselineCo2,
        deltaPpm: deltaCo2,
        status: statusCo2,
        oceanAtmosphereFluxMmolM2Day: co2Flux,
        salibuoySinkOffsetTonnesDay: Math.round(Math.abs(co2Flux) * 18.5),
        attribution: {
          fossilFuelPct: 28,
          transportPct: 22,
          marineDegassingPct: 15,
          naturalVegetationPct: 35
        },
        trend24h: Number((Math.sin(lng * 0.4) * 0.8).toFixed(2)),
        keelingDiscrepancy: `Dynamic geodetic extrapolation from nearest global baseline station.`
      },
      methane: {
        ppb: methanePpb,
        baselinePpb: baselineCh4,
        deltaPpb: deltaCh4,
        status: statusCh4,
        subseaHydrateStabilityPct: clathrateStability,
        gwp20ImpactFactor: 84,
        attribution: {
          subseaClathratePct: acousticFlare ? 72 : 15,
          agriculturalEntericPct: 45,
          wetlandBiogenicPct: 25,
          fugitiveFossilPct: 15
        },
        acousticBubbleFlareDetected: acousticFlare,
        marineOHOxidationRatePpbDay: 0.65,
        plumeRiskDescription: acousticFlare 
          ? 'Subsea methane seepage alert active in regional trench!' 
          : 'Normal maritime tropospheric methane dispersion pattern.'
      },
      aqi,
      aqiCategory,
      pm25: Number((aqi * 0.22).toFixed(1)),
      pm10: Number((aqi * 0.48).toFixed(1)),
      troposphericOzonePpb: Number((18 + Math.sin(lat) * 8).toFixed(1)),
      nitrousOxidePpb: 336.2,
      overallAirQualitySummary: `Pristine maritime marine layer; ${aqiCategory} index with ${co2Ppm} ppm CO2.`
    }
  };
}

export function getCompassHeading(degrees: number): string {
  const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
  const index = Math.round(((degrees % 360) / 22.5)) % 16;
  return directions[index];
}
