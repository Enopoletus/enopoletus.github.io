import pandas as pd
import matplotlib.pyplot as plt, mpld3
import numpy as np
import scipy.signal as sp
import matplotlib.ticker as plticker
df=pd.read_csv('numbers.csv')
df.columns=['DATE', 'EMPLOYEES']
df.DATE=df.DATE.map(lambda x: x.replace('-01-01', ''))
df.DATE=pd.to_numeric(df.DATE)
df.EMPLOYEES=np.log(df.EMPLOYEES)
trend=sp.savgol_filter(df.EMPLOYEES, 59, 4)
unsp=df.EMPLOYEES-trend
unep=abs(unsp)
unyp=(sp.savgol_filter(unep, 59, 6))
uns=-(unsp)*(.5/(np.log(2)-np.log(1)))
une=abs(uns)
uny=(sp.savgol_filter(une, 59, 6))
unw=uns+uny-(uns+uny).min()
plt.xticks(rotation=90)
plt.xticks(np.arange(1929, 2017, 5))
axes = plt.gca()
axes.set_ylim([unw.min(), unw.max()])
axes.set_xlim([df.DATE.min(), df.DATE.max()])
plt.plot(df.DATE, unw, color='blue', lw=2)
plt.savefig('foo.png', bbox_inches='tight')
