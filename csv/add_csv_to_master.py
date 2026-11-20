"""
Append all csv files in the csv folder to master.csv
Creates a new master.csv each time it runs (old version overwritten)
"""

import csv
import glob
import os

PATH = os.path.dirname(os.path.abspath(__file__))
CSV_DIR = PATH
MASTER = os.path.join(PATH, "master.csv")
HEADER = ["ParticipantID", "TrialNum", "Vis", "TruePercent", "ReportedPercent"]

files = sorted(
    path for path in glob.glob(os.path.join(CSV_DIR, "*.csv"))
    if os.path.abspath(path) != os.path.abspath(MASTER)
)

row_count = 0

with open (MASTER, "w", newline="") as out:
    writer = csv.writer(out)
    writer.writerow(HEADER)

    for path in files:
        with open (path, newline="") as f:
            reader = csv.reader(f)
            next(reader, None)
            for row in reader:
                if row:
                    writer.writerow(row)
                    row_count += 1

print ("combined csvs")