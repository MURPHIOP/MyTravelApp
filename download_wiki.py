import urllib.request, json, os

os.makedirs('public/destinations', exist_ok=True)

places = {
    'ajanta': 'Ajanta_Caves',
    'ellora': 'Ellora_Caves',
    'grishneshwar': 'Grishneshwar_Temple',
    'shirdi': 'Sai_Baba_of_Shirdi',
    'trimbakeshwar': 'Trimbakeshwar_Shiva_Temple',
    'nashik': 'Ramkund',
    'bhimashankar': 'Bhimashankar_Temple',
    'panchvati': 'Panchavati',
    'sula': 'Sula_Vineyards'
}

for key, title in places.items():
    try:
        url = f"https://en.wikipedia.org/w/api.php?action=query&titles={title}&prop=pageimages&format=json&pithumbsize=1000"
        req = urllib.request.Request(url, headers={'User-Agent': 'TravelAppScript/1.0'})
        res = json.loads(urllib.request.urlopen(req).read())
        pages = res['query']['pages']
        page_id = list(pages.keys())[0]
        if 'thumbnail' in pages[page_id]:
            img_url = pages[page_id]['thumbnail']['source']
            urllib.request.urlretrieve(img_url, f"public/destinations/{key}.jpg")
            print(f"Downloaded {key}.jpg")
        else:
            print(f"No image for {key}")
    except Exception as e:
        print(f"Failed {key}: {e}")
