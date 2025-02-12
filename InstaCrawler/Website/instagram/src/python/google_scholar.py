# # import requests
# # from bs4 import BeautifulSoup
# # import pandas as pd
# # import re
# # from datetime import datetime

# # # URL of your Google Scholar profile
# # SCHOLAR_URL = "https://scholar.google.ca/citations?user=mroBfIwAAAAJ&hl=en"

# # # Headers to mimic a browser request
# # HEADERS = {
# #     "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36"
# # }

# # # Get the current year to avoid incorrect year extraction
# # CURRENT_YEAR = datetime.now().year

# # def clean_journal_name(journal_info):
# #     """Extracts only the journal name by removing numbers and special characters after it."""
# #     if journal_info:
# #         return re.sub(r'\d.*', '', journal_info).strip()
# #     return "Unknown"

# # def extract_year(journal_info):
# #     """Extracts the correct publication year (four-digit number between 1900 and the current year)."""
# #     if journal_info:
# #         years = re.findall(r'\b(19\d{2}|20\d{2})\b', journal_info)  # Finds only valid years
# #         return int(years[-1]) if years else 0  # Use the last valid year if multiple found
# #     return 0  # Default to 0 if no year is found

# # def scrape_google_scholar(url):
# #     response = requests.get(url, headers=HEADERS)
# #     if response.status_code != 200:
# #         print(f"Failed to fetch page: {response.status_code}")
# #         return None

# #     soup = BeautifulSoup(response.text, 'html.parser')

# #     # Extract papers and citations
# #     papers = []
# #     for row in soup.select('tr.gsc_a_tr'):
# #         title_tag = row.select_one('td.gsc_a_t a')
# #         citation_tag = row.select_one('td.gsc_a_c')
# #         details = row.select('div.gs_gray')

# #         if title_tag and citation_tag and len(details) >= 2:
# #             title = title_tag.text
# #             link = "https://scholar.google.ca" + title_tag['href']
# #             citation_count = citation_tag.text.strip()
# #             citation_count = int(citation_count) if citation_count.isdigit() else 0

# #             authors = details[0].text  # First div contains authors
# #             journal_info = details[1].text  # Second div contains journal name & year

# #             # Extract journal name and year separately
# #             journal_name = clean_journal_name(journal_info)
# #             year = extract_year(journal_info)

# #             papers.append({
# #                 "Title": title,
# #                 "Citations": citation_count,
# #                 "Link": link,
# #                 "Authors": authors,
# #                 "Journal": journal_name,
# #                 "Year": year
# #             })

# #     # Extract total citations and h-index
# #     metrics = soup.select('td.gsc_rsb_std')
# #     total_citations = int(metrics[0].text) if metrics else 0
# #     h_index = int(metrics[2].text) if len(metrics) > 2 else 0

# #     return papers, total_citations, h_index

# # # Run scraping
# # papers, total_citations, h_index = scrape_google_scholar(SCHOLAR_URL)

# # # Save results to a CSV file
# # if papers:
# #     df = pd.DataFrame(papers)

# #     # Sort by Year (Descending: most recent first)
# #     df = df.sort_values(by="Year", ascending=False)

# #     df.to_csv("google_scholar_papers.csv", index=False)

# #     print(f"Saved {len(papers)} papers to 'google_scholar_papers.csv'.")
# #     print(f"Total Citations: {total_citations}")
# #     print(f"H-index: {h_index}")
# # else:
# #     print("No data scraped.")


# import requests
# from bs4 import BeautifulSoup
# import json
# import re
# from datetime import datetime

# # URL of your Google Scholar profile
# SCHOLAR_URL = "https://scholar.google.ca/citations?user=mroBfIwAAAAJ&hl=en"

# # Headers to mimic a browser request
# HEADERS = {
#     "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36"
# }

# # Get the current year to avoid incorrect year extraction
# CURRENT_YEAR = datetime.now().year

# def clean_journal_name(journal_info):
#     """Extracts only the journal name by removing numbers and special characters after it."""
#     if journal_info:
#         return re.sub(r'\d.*', '', journal_info).strip()
#     return "Unknown"

# def extract_year(journal_info):
#     """Extracts the correct publication year (four-digit number between 1900 and the current year)."""
#     if journal_info:
#         years = re.findall(r'\b(19\d{2}|20\d{2})\b', journal_info)  # Finds only valid years
#         return int(years[-1]) if years else 0  # Use the last valid year if multiple found
#     return 0  # Default to 0 if no year is found

# def scrape_google_scholar(url):
#     response = requests.get(url, headers=HEADERS)
#     if response.status_code != 200:
#         print(f"Failed to fetch page: {response.status_code}")
#         return None

#     soup = BeautifulSoup(response.text, 'html.parser')

#     # Extract papers and citations
#     papers = []
#     for row in soup.select('tr.gsc_a_tr'):
#         title_tag = row.select_one('td.gsc_a_t a')
#         citation_tag = row.select_one('td.gsc_a_c')
#         details = row.select('div.gs_gray')

#         if title_tag and citation_tag and len(details) >= 2:
#             title = title_tag.text
#             link = "https://scholar.google.ca" + title_tag['href']
#             citation_count = citation_tag.text.strip()
#             citation_count = int(citation_count) if citation_count.isdigit() else 0

#             authors = details[0].text  # First div contains authors
#             journal_info = details[1].text  # Second div contains journal name & year

#             # Extract journal name and year separately
#             journal_name = clean_journal_name(journal_info)
#             year = extract_year(journal_info)

#             papers.append({
#                 "Title": title,
#                 "Citations": citation_count,
#                 "Link": link,
#                 "Authors": authors,
#                 "Journal": journal_name,
#                 "Year": year
#             })

#     # Extract total citations and h-index
#     metrics = soup.select('td.gsc_rsb_std')
#     total_citations = int(metrics[0].text) if metrics else 0
#     h_index = int(metrics[2].text) if len(metrics) > 2 else 0

#     return papers, total_citations, h_index

# # Run scraping
# papers, total_citations, h_index = scrape_google_scholar(SCHOLAR_URL)

# # Save results to a JSON file
# if papers:
#     papers = sorted(papers, key=lambda x: x["Year"], reverse=True)  # Sort by Year (Descending)

#     scholar_data = {
#         "Total_Citations": total_citations,
#         "H_index": h_index,
#         "Papers": papers
#     }

#     with open("../Academic/Childs/Papers/List.jsx", "w", encoding="utf-8") as json_file:
#         json.dump(scholar_data, json_file, ensure_ascii=False, indent=4)

#     print(f"Saved {len(papers)} papers to 'google_scholar_papers.json'.")
#     print(f"Total Citations: {total_citations}")
#     print(f"H-index: {h_index}")
# else:
#     print("No data scraped.")


import requests
from bs4 import BeautifulSoup
import re
import uuid
from datetime import datetime

# URL of your Google Scholar profile
SCHOLAR_URL = "https://scholar.google.ca/citations?user=mroBfIwAAAAJ&hl=en"

# Headers to mimic a browser request
HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36"
}

# Get the current year to avoid incorrect year extraction
CURRENT_YEAR = datetime.now().year

def clean_journal_name(journal_info):
    """Extracts only the journal name by removing numbers and special characters after it."""
    if journal_info:
        return re.sub(r'\d.*', '', journal_info).strip()
    return "Unknown"

def extract_year(journal_info):
    """Extracts the correct publication year (four-digit number between 1900 and the current year)."""
    if journal_info:
        years = re.findall(r'\b(19\d{2}|20\d{2})\b', journal_info)  # Finds only valid years
        return int(years[-1]) if years else 0  # Use the last valid year if multiple found
    return 0  # Default to 0 if no year is found

def scrape_google_scholar(url):
    response = requests.get(url, headers=HEADERS)
    if response.status_code != 200:
        print(f"Failed to fetch page: {response.status_code}")
        return None

    soup = BeautifulSoup(response.text, 'html.parser')

    # Extract papers and citations
    papers = []
    for row in soup.select('tr.gsc_a_tr'):
        title_tag = row.select_one('td.gsc_a_t a')
        citation_tag = row.select_one('td.gsc_a_c')
        details = row.select('div.gs_gray')

        if title_tag and citation_tag and len(details) >= 2:
            title = title_tag.text
            link = "https://scholar.google.ca" + title_tag['href']
            citation_count = citation_tag.text.strip()
            citation_count = int(citation_count) if citation_count.isdigit() else 0

            authors = details[0].text  # First div contains authors
            journal_info = details[1].text  # Second div contains journal name & year

            # Extract journal name and year separately
            journal_name = clean_journal_name(journal_info)
            year = extract_year(journal_info)

            papers.append({
                "id": str(uuid.uuid4()),  # Generate a unique ID for each paper
                "Title": title,
                "Citations": citation_count,
                "Link": link,
                "Authors": authors,
                "Journal": journal_name,
                "Year": year
            })

    # Extract total citations and h-index
    metrics = soup.select('td.gsc_rsb_std')
    total_citations = int(metrics[0].text) if metrics else 0
    h_index = int(metrics[2].text) if len(metrics) > 2 else 0

    return papers, total_citations, h_index

def generate_jsx_file(papers, total_citations, h_index, filename="../Academic/Childs/Papers/List.jsx"):
    """Generates a JSX file containing the scraped data"""
    papers = sorted(papers, key=lambda x: x["Year"], reverse=True)  # Sort by Year (Descending)

    jsx_content = "export const List = [\n"
    for paper in papers:
        jsx_content += f"""  {{
    id: "{paper['id']}",
    Title: "{paper['Title']}",
    Citations: {paper['Citations']},
    Link: "{paper['Link']}",
    Authors: "{paper['Authors']}",
    Journal: "{paper['Journal']}",
    Year: {paper['Year']}
  }},\n"""
    
    jsx_content += "];\n\n"
    jsx_content += f"export const TotalCitations = {total_citations};\n"
    jsx_content += f"export const HIndex = {h_index};\n"

    # Save to file
    with open(filename, "w", encoding="utf-8") as f:
        f.write(jsx_content)

    print(f"Saved {len(papers)} papers to '{filename}'.")
    print(f"Total Citations: {total_citations}")
    print(f"H-index: {h_index}")

# Run scraping
papers, total_citations, h_index = scrape_google_scholar(SCHOLAR_URL)

# Generate JSX file
if papers:
    generate_jsx_file(papers, total_citations, h_index)
else:
    print("No data scraped.")
