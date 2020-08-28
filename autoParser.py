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
df2  =pd.DataFrame(({"Date":[today],"Active Cases":[fdataList[1]],"Recoveries":[fdataList[2]],"Death":[fdataList[3]],"Confirmed":[fdataList[0]]}))
df1 = df1.append(df2)
print(df1)

f2 = open('data/data1.csv', 'a')
df1.to_csv(f2, header=False)

f1.close()
f2.close()

# LOAD DATA2 FOR DETAILS (let's do string replacement,I'm lazy now..zzz)
db2Csv = pd.read_csv(r'data/data2.csv')
df2 = pd.DataFrame(db2Csv)

# Patient,Age,Gender,Location,Condition,Status,Date
# ◙ PHOC-152 is a 62 year-old Filipino male from Barretto
print('Step 2: Update New Cases')
f1 = open("data/newCases.txt", "r+")
fdata = f1.read()
fdata = fdata.strip()
fdata = fdata.replace("â—™ ", "")
fdata = fdata.replace(" is a ", ",")
fdata = fdata.replace(" year-old Filipino ", ",")
fdata = fdata.replace(" is a ", ",")
fdata = fdata.replace(" from ", ",")
fdata = fdata.replace("female", "F")
fdata = fdata.replace("male", "M")
fdataList = fdata.splitlines()

length = len(fdataList) 


f2 = open("data/data2.csv", "a+")
today = datetime.today().strftime('%d/%m/%Y')

for i in range(length): 
     f2.write(fdataList[i] + ',,Active,' + today + '\n')

f1.close()
f2.close()

# remove content for update

f1 = open("data/newCases.txt", "w")
f2 = open('data/dailt.txt', 'w')

print('Step 3: Empty daily updates')
f1.write('')
f2.write('')