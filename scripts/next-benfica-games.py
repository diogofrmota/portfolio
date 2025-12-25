import os
import requests
from datetime import datetime

API_TOKEN = os.getenv("FOOTBALL_DATA_API_KEY")
if not API_TOKEN:
    raise RuntimeError("Set FOOTBALL_DATA_API_KEY environment variable first")

TEAM_ID = 1903
API_URL = f"https://api.football-data.org/v4/teams/{TEAM_ID}/matches"
params = {"status": "SCHEDULED", "limit": 30}
headers = {"X-Auth-Token": API_TOKEN}

resp = requests.get(API_URL, headers=headers, params=params)
resp.raise_for_status()
matches = resp.json().get("matches", [])

TARGET_NAME = "Sport Lisboa e Benfica"

# Get only home games
home_games = []
for match in matches:
    home_name = match.get("homeTeam", {}).get("name", "")
    if home_name == TARGET_NAME:
        home_games.append(match)
    if len(home_games) >= 5:
        break

# Month names for date formatting
month_names = {
    1: "January", 2: "February", 3: "March", 4: "April",
    5: "May", 6: "June", 7: "July", 8: "August",
    9: "September", 10: "October", 11: "November", 12: "December"
}

# Read the HTML file
html_file_path = "../benfica/index.html"
with open(html_file_path, 'r', encoding='utf-8') as file:
    html_content = file.read()

# Generate the games HTML
games_html = ""
for match in home_games:
    date_iso = match.get("utcDate", "")
    if date_iso:
        date_obj = datetime.fromisoformat(date_iso.replace("Z", "+00:00"))
        day = date_obj.day
        month_num = date_obj.month
        month_name = month_names.get(month_num, f"Month{month_num}")
        date_str = f"{day}/{month_name}"
    else:
        date_str = "TBD"
    
    away_name = match.get("awayTeam", {}).get("name", "")
    
    # Create the game line
    games_html += f'      <p>{date_str} - Sport Lisboa e Benfica vs {away_name}</p>\n'

# Update the games section in HTML
start_marker = '      <p><a class="link">next benfica games at estádio da luz:</a></p>\n      \n'
end_marker = '      <p>last updated:'

# Find the section to replace
start_index = html_content.find(start_marker) + len(start_marker)
end_index = html_content.find(end_marker)

# Create new HTML content
new_html_content = html_content[:start_index] + games_html + html_content[end_index:]

# Update the last updated date
current_date = datetime.now().strftime("%d/%m/%Y")
updated_marker = '      <p>last updated: '
date_start = new_html_content.find(updated_marker) + len(updated_marker)
date_end = new_html_content.find('</p>', date_start)
new_html_content = new_html_content[:date_start] + current_date + new_html_content[date_end:]

# Write back to file
with open(html_file_path, 'w', encoding='utf-8') as file:
    file.write(new_html_content)

print(f"HTML file updated successfully!")
print(f"Updated {len(home_games)} games")
print(f"Last updated: {current_date}")