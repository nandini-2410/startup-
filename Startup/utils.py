import json
import os

def load_startups():
    base_dir = os.path.dirname(os.path.abspath(__file__))
    path = os.path.join(base_dir, 'dataset', 'startup_navigator_india_biased_200.json')
    with open(path, 'r') as f:
        return json.load(f)

def match_startups(user_domain, user_funding):
    all_startups = load_startups()
    matched = []
    for s in all_startups:
        try:
            min_fund = int(s.get("minFunding", 0))
        except Exception:
            min_fund = 0
        if s.get("domain", "").lower() == user_domain.lower() and min_fund <= user_funding:
            matched.append(s)
    return matched
