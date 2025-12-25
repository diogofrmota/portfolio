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

# ANSI codes
BOLD = "\033[1m"
UNDERLINE = "\033[4m"
RESET = "\033[0m"
TARGET_NAME = "Sport Lisboa e Benfica"

print(f"{UNDERLINE}Next Benfica games at Estádio da Luz:{RESET}\n")

home_games = []
for match in matches:
    home_name = match.get("homeTeam", {}).get("name", "")

    # Only collect home games
    if home_name == TARGET_NAME:
        home_games.append(match)

    # Stop when we have 5 home games
    if len(home_games) >= 5:
        break

# Month names for date formatting
month_names = {
    1: "January", 2: "February", 3: "March", 4: "April",
    5: "May", 6: "June", 7: "July", 8: "August",
    9: "September", 10: "October", 11: "November", 12: "December"
}

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

    # Format with Benfica in bold
    output = f"{date_str} - {BOLD}{TARGET_NAME}{RESET} vs {away_name}"
    print(output)

print()
print(f"last updated: {datetime.now().strftime('%d/%m/%Y')}")