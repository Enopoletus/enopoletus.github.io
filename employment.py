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
uns=-(df.EMPLOYEES-sp.savgol_filter(df.EMPLOYEES, 71, 4))
une=abs(uns)
uny=(sp.savgol_filter(une, 71, 6))
unw=uns+uny-(uns+uny).min()
plt.xticks(rotation=90)
plt.xticks(np.arange(1929, 2017, 5))
axes = plt.gca()
axes.set_ylim([unw.min(), unw.max()])
plt.plot(df.DATE, unw, color='blue', lw=2)
plt.savefig('foo.png', bbox_inches='tight')
