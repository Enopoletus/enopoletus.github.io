from pathlib import Path
import operator
import random
import matplotlib.pyplot as plt
import numpy as np
import pandas as pd
import sys
sys.setrecursionlimit(10000)
WORKBOOK = Path(__file__).with_name("mpd2023_web.xlsx")
# The workbook has a title row and a region row before its year/country-code headers.
gdp = pd.read_excel(WORKBOOK, sheet_name="GDPpc", header=2)
population = pd.read_excel(WORKBOOK, sheet_name="Population", header=2)

gdp["year"] = pd.to_numeric(gdp["year"], errors="coerce")
population["year"] = pd.to_numeric(population["year"], errors="coerce")
gdp = gdp.set_index("year")
population = population.set_index("year")

country_codes = input("Enter 3-letter country codes; separate by spaces: ").upper().split()
if not country_codes:
    raise SystemExit("Enter at least one country code.")

missing = [code for code in country_codes if code not in gdp.columns]
if missing:
    raise SystemExit("Unknown country code(s): " + ", ".join(missing))
if "GBR" not in gdp.columns:
    raise SystemExit("The GDPpc sheet does not contain the GBR reference column.")

scale = input("log or linear? ").strip().lower()
if scale not in {"log", "linear"}:
    raise SystemExit("Scale must be 'log' or 'linear'.")
start_year = int(input("Enter start year: "))
end_year = int(input("Enter end year: "))
if start_year > end_year:
    raise SystemExit("Start year must be no later than end year.")

fig, ax = plt.subplots()
fig.subplots_adjust(right=0.88)
ax.set_yscale(scale)
ax.set_xlim(start_year, end_year)
ax.set_xticks(np.arange(start_year, end_year + 1, 10))
ax.tick_params(axis="x", labelrotation=90)

values_in_range = []
color2 = []

for code in country_codes:
    ratio = (gdp[code]).astype("float64") #divide by country here
    ratio = ratio[np.isfinite(ratio)]

    if code == "CUB":
        ratio = ratio * 2.3
    elif code == "IDN":
        weight = (2011 - ratio.index) / (2011 - 1880)
        weight = weight.clip(lower=0, upper=1)
        ratio = (ratio * 0.82 * weight) + (ratio * (1 - weight))

    visible = ratio.loc[start_year:end_year].dropna()
    if visible.empty:
        raise SystemExit(f"No GDP data for {code} between {start_year} and {end_year}.")
    if scale == "log" and (visible <= 0).any():
        raise SystemExit(f"Log scale requires positive values; {code} has nonpositive data in the selected years.")

    color1 = []

    def colorpick():
        red = random.random()
        blue = random.random()
        green = random.random()
        toobland = []
        if len(color2) > 0:
            for previous_color in color2:
                if sum(map(abs, map(operator.sub, previous_color, [red, green, blue]))) < 2 / np.sqrt(len(country_codes)):
                    toobland.append(1)
        if 0 < (red * 0.213) + (blue * 0.072) + (green * 0.715) < 0.6 and len(toobland) < 1:
            color1.extend([red, green, blue])
            color2.append(color1)
        else:
            colorpick()

    colorpick()
    ax.plot(ratio.index, ratio, color=color1, linewidth=1, label=code)
    ax.annotate(code, xy=(1.0, visible.iloc[-1]), xycoords=("axes fraction", "data"), xytext=(5, 0), textcoords="offset points", ha="left", va="center", fontsize="xx-small", color=color1, annotation_clip=False)
    values_in_range.extend(visible.tolist())

ax.set_ylim(0 if scale == "linear" else min(values_in_range), max(values_in_range))
ax.legend(loc="best", fontsize="xx-small", labelspacing=0.1)
ax.grid(which="both", axis="y")
ax.grid(which="major", axis="x")
ax.set_ylabel("GDP per capita (PPP), 2011 USD")
plt.show()
