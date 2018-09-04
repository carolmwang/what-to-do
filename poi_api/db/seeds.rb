# Referenced Arjun Venkat's git repo for how to seed a Rails database with a csv file
# https://gist.github.com/arjunvenkat/1115bc41bf395a162084

require 'csv'

csv_text = File.read(Rails.root.join('lib', 'seeds', 'cities.csv'))
csv = CSV.parse(csv_text, :headers => true, :encoding => 'ISO-8859-1')
csv.each do |row|
  t = City.new
  t.data_id = row['data_id']
  t.name = row['name']
  t.save
  puts "#{t.data_id}, #{t.name} saved"
end