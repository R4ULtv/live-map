import json
import requests

def add_iso_codes_to_geojson(geojson_file, output_file):
  """Adds ISO alpha-2 and alpha-3 codes to the properties of each country in a GeoJSON file.

  Args:
      geojson_file: Path to the input GeoJSON file.
      output_file: Path to save the modified GeoJSON file.
  """

  with open(geojson_file, 'r') as f:
    data = json.load(f)

  # Fetch country data from REST Countries API
  response = requests.get('https://restcountries.com/v3.1/all')
  countries_data = response.json()

  # Create a dictionary mapping country names to ISO codes
  country_codes = {}
  for country in countries_data:
    common_name = country.get('name', {}).get('common', '')
    official_name = country.get('name', {}).get('official', '')
    if common_name or official_name:
      iso_codes = {
          'Alpha2': country.get('cca2', ''),
          'Alpha3': country.get('cca3', '')
      }
      if common_name:
        country_codes[common_name] = iso_codes
      if official_name:
        country_codes[official_name] = iso_codes

  # Add ISO codes to GeoJSON properties
  for feature in data['objects']['countries']['geometries']:
    country_name = feature['properties']['name']
    iso_codes = country_codes.get(country_name, {})
    feature['properties'].update(iso_codes)

  # Save the modified GeoJSON data
  with open(output_file, 'w') as f:
    json.dump(data, f, indent=2)


if __name__ == '__main__':
  input_geojson = 'public/countries-110m.json'  # Replace with your input file
  output_geojson = 'test.json'  # Replace with desired output file
  add_iso_codes_to_geojson(input_geojson, output_geojson)