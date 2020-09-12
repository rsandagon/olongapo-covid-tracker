import pandas as pd
from datetime import datetime

db2Csv = pd.read_csv(r'data/data1.csv')
df1 = pd.DataFrame(db2Csv)

# header
# Date,Active Cases,Recoveries,Death,Confirmed

# daily.txt
# Confirmed Cases - 161
# Active Cases - 83
# Recovered - 72
# Death - 6
# Suspect Cases - 7
# Probable Case - 0
print('Step 1: Update Daily Stats')
f1 = open("data/daily.txt", "r")

fdata = f1.read()
fdata = fdata.lower()
fdata = fdata.strip()
fdata = fdata.replace(" ", "")
fdata = fdata.replace("-", "")
fdataList = fdata.splitlines()
length = len(fdataList) 
for i in range(length): 
    fdataList[i] = ''.join(filter(str.isdigit, fdataList[i]))
today = datetime.today().strftime('%d %m %Y')
if length > 0 :
    f2 = open("data/data1.csv", "a+")
    f2.write(today + ',' + fdataList[1] + ',' + fdataList[2] + ',' + fdataList[3] + ',' + fdataList[0]  +'\n')
    f2.close()

f1.close()

# LOAD DATA2 FOR DETAILS (let's do string replacement,I'm lazy now..zzz)
db2Csv = pd.read_csv(r'data/data2.csv')
df2 = pd.DataFrame(db2Csv)

# Patient,Age,Gender,Location,Condition,Status,Date
# ◙ PHOC-152 is a 62 year-old Filipino male from Barretto
# -year-old Filipino M
print('Step 2: Update New Cases')
f1 = open("data/newCases.txt", "r+")

fdata = f1.read()
fdata = fdata.strip()
fdata = fdata.replace("â—™ ", "")
fdata = fdata.replace("◙ ", "")
fdata = fdata.replace(" who is a ", ",")
fdata = fdata.replace(" is a ", ",")
fdata = fdata.replace(" is an ", ",")
fdata = fdata.replace("-year-old Filipino ", ",")
fdata = fdata.replace(" year-old Filipino ", ",")
fdata = fdata.replace(" year-old ", ",")
fdata = fdata.replace(" is a ", ",")
fdata = fdata.replace(" from ", ",")
fdata = fdata.replace("female", "F")
fdata = fdata.replace("male", "M")
fdataList = fdata.splitlines()
length = len(fdataList) 
if length > 0 :
    f2 = open("data/data2.csv", "a+")
    today = datetime.today().strftime('%d/%m/%Y')
    for i in range(length): 
        f2.write(fdataList[i] + ',,Active,' + today + '\n')
    f2.close()
f1.close()

# remove content for update
f1 = open("data/newCases.txt", "w")
f2 = open('data/daily.txt', 'w')

print('Step 3: Empty daily updates')
f1.write('')
f2.write('')
