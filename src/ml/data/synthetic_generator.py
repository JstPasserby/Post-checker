# src/ml/data/synthetic_generator.py
"""
Synthetic data generator for Instagram posts.
Generates realistic posts with known violation patterns.
"""

import random
import json
import pandas as pd
from pathlib import Path
from datetime import datetime, timedelta

# from typing import List, Dict, Tuple
import hashlib


class InstagramDataGenerator:
    """Generate synthetic Instagram posts with violation labels"""

    def __init__(self, seed: int = 42):
        random.seed(seed)
        self.output_dir = Path("data/synthetic")
        self.output_dir.mkdir(parents=True, exist_ok=True)

        # Load templates and patterns
        self._load_templates()

    def _load_templates(self):
        """Load all text templates for different content types"""

        # Violation categories (Instagram's actual policy areas)
        self.violation_categories = {
            "hate_speech": {
                "weight": 0.15,  # 15% of violations
                "templates": [
                    "I can't stand {group}, they're all {negative_trait}",
                    "{group} people shouldn't be allowed to {action}",
                    "Why do {group} always have to {negative_behavior}?",
                    "Get rid of all {group}, they ruin everything",
                    "{group} are the worst thing to happen to {place}",
                ],
            },
            "bullying_harassment": {
                "weight": 0.20,
                "templates": [
                    "Look at {person}, thinks they're so {positive_trait} but they're actually {negative_trait}",
                    "Nobody likes {person}, just go away already",
                    "{person} should just delete their account, embarrassing",
                    "Why does {person} even post, no one cares",
                    "Everyone laugh at {person} for {action}",
                ],
            },
            "violent_content": {
                "weight": 0.10,
                "templates": [
                    "Someone needs to {violent_action} {person}",
                    "I'm going to {violent_action} if I see another post like this",
                    "{person} deserves to be {violent_consequence}",
                    "Time to {violent_action} these {group}",
                    "Violence is the only answer to {issue}",
                ],
            },
            "sexual_content": {
                "weight": 0.15,
                "templates": [
                    "Check out this {explicit_content} I found",
                    "DM me for {sexual_favor}",
                    "Looking for {sexual_activity} tonight",
                    "My {body_part} is so {sexual_adjective}",
                    "Who wants to see my {sexual_content}?",
                ],
            },
            "spam": {
                "weight": 0.10,
                "templates": [
                    "CLICK HERE for FREE {product}!!! {url}",
                    "Make ${money} daily working from home!!! {url}",
                    "I made ${money} in one week using {product} {url}",
                    "Follow me @{spam_account} for more posts like this",
                    "Tag 5 friends or bad luck for {years} years!!!",
                ],
            },
            "self_harm": {
                "weight": 0.05,
                "templates": [
                    "I want to {self_harm_action} myself",
                    "Life isn't worth living anymore",
                    "Thinking about {self_harm_action} tonight",
                    "No one would care if I {self_harm_action}",
                    "I'm going to end it all",
                ],
            },
            "misinformation": {
                "weight": 0.10,
                "templates": [
                    "BREAKING: {conspiracy_theory}",
                    "They don't want you to know that {misinformation}",
                    "Doctors hate this one trick to {health_miracle}",
                    "Share this before it's deleted! {fake_news}",
                    "100% real: {unbelievable_claim}",
                ],
            },
            "safe": {
                "weight": 0.85,  # 85% of posts are safe (realistic ratio)
                "templates": [
                    "Just had the best coffee at {place}! ☕️ #coffee #morningvibes",
                    "Beautiful sunset at {place} today 🌅 #nature #peaceful",
                    "Grateful for {positive_thing} today 🙏 #blessed #gratitude",
                    "Hanging out with {person}, best friend ever! ❤️ #friends",
                    "New haircut, what do you think? 💇‍♀️ #transformation",
                    "Workout done for the day! {exercise} was tough but worth it 💪",
                    "My cat {pet_name} being adorable as always 🐱 #catlover",
                    "Just finished {book_name}, highly recommend! 📚 #reading",
                    "Made {food} from scratch today, turned out amazing! 🍳 #cooking",
                    "Throwback to that time at {place} with {person} 📸 #tbt",
                ],
            },
        }

        # Vocabulary for filling templates
        self.vocab = {
            "groups": [
                "immigrants",
                "muslims",
                "jews",
                "black people",
                "white people",
                "asians",
                "latinos",
                "women",
                "men",
                "lgbtq",
                "transgender people",
            ],
            "negative_traits": [
                "stupid",
                "lazy",
                "annoying",
                "ugly",
                "greedy",
                "ignorant",
                "dangerous",
                "disgusting",
            ],
            "positive_traits": [
                "smart",
                "beautiful",
                "talented",
                "rich",
                "popular",
                "successful",
                "perfect",
                "amazing",
            ],
            "actions": [
                "exist",
                "speak",
                "post",
                "have rights",
                "get jobs",
                "live here",
                "breathe",
            ],
            "negative_behaviors": [
                "complain",
                "ruin everything",
                "cause problems",
                "act entitled",
                "take over",
            ],
            "places": [
                "this country",
                "the world",
                "our neighborhood",
                "society",
                "social media",
                "the internet",
            ],
            "people": [
                "@user123",
                "@influencer",
                "@celebrity",
                "@brand",
                "@friend",
                "my neighbor",
                "my coworker",
                "my ex",
                "this random person",
            ],
            "violent_actions": [
                "kill",
                "hurt",
                "destroy",
                "attack",
                "punch",
                "shoot",
                "bomb",
            ],
            "violent_consequences": ["hurt", "killed", "punished", "taught a lesson"],
            "explicit_content": [
                "hot pics",
                "private photos",
                "adult content",
                "xxx videos",
            ],
            "sexual_favors": ["fun", "a good time", "some action", "private show"],
            "sexual_activities": ["hook up", "have fun", "get together", "hang out"],
            "body_parts": ["ass", "boobs", "dick", "pussy", "body"],
            "sexual_adjectives": ["sexy", "hot", "horny", "wet", "hard"],
            "products": ["iPhone", "money", "gift card", "crypto", "course", "ebook"],
            "money": ["100", "500", "1000", "5000", "10000"],
            "spam_accounts": [
                "spam_bot123",
                "promo_king",
                "free_follows",
                "money_maker",
            ],
            "years": ["5", "7", "10", "13", "20"],
            "self_harm_actions": ["hurt", "kill", "cut", "harm", "end"],
            "conspiracy_theories": [
                "5G causes COVID",
                "lizard people run the government",
                "the moon landing was fake",
                "vaccines have microchips",
            ],
            "misinformation": [
                "vaccines cause autism",
                "drinking bleach cures disease",
                "the earth is flat",
                "climate change is a hoax",
            ],
            "health_miracles": [
                "lose weight fast",
                "cure cancer naturally",
                "detox your body",
                "boost immunity",
            ],
            "fake_news": [
                "celebrity died",
                "government collapse",
                "alien invasion",
                "new world order",
            ],
            "unbelievable_claims": [
                "man flies using homemade wings",
                "woman gives birth to alien",
                "time traveler arrested",
                "cow gives birth to human",
            ],
            "places_real": [
                "Starbucks",
                "Central Park",
                "the beach",
                "downtown",
                "the gym",
                "home",
                "work",
            ],
            "positive_things": [
                "my family",
                "my health",
                "my friends",
                "this weather",
                "good food",
                "a nice walk",
                "my job",
            ],
            "exercises": ["Leg day", "Cardio", "Yoga", "HIIT", "Weight training"],
            "pet_names": ["Luna", "Max", "Bella", "Charlie", "Lucy", "Cooper"],
            "book_names": [
                "Atomic Habits",
                "Project Hail Mary",
                "Dune",
                "The Silent Patient",
            ],
            "foods": ["pasta", "pizza", "sushi", "salad", "cake", "bread"],
        }

    def _fill_template(self, template: str, category: str) -> str:
        """Fill a template with random vocabulary"""
        replacements = {
            "{group}": random.choice(self.vocab["groups"]),
            "{negative_trait}": random.choice(self.vocab["negative_traits"]),
            "{positive_trait}": random.choice(self.vocab["positive_traits"]),
            "{action}": random.choice(self.vocab["actions"]),
            "{negative_behavior}": random.choice(self.vocab["negative_behaviors"]),
            "{place}": random.choice(self.vocab["places"] + self.vocab["places_real"]),
            "{person}": random.choice(self.vocab["people"]),
            "{violent_action}": random.choice(self.vocab["violent_actions"]),
            "{violent_consequence}": random.choice(self.vocab["violent_consequences"]),
            "{explicit_content}": random.choice(self.vocab["explicit_content"]),
            "{sexual_favor}": random.choice(self.vocab["sexual_favors"]),
            "{sexual_activity}": random.choice(self.vocab["sexual_activities"]),
            "{body_part}": random.choice(self.vocab["body_parts"]),
            "{sexual_adjective}": random.choice(self.vocab["sexual_adjectives"]),
            "{product}": random.choice(self.vocab["products"]),
            "{url}": random.choice(["linkin.bio/xxx", "tinyurl.com/xxx", "bit.ly/xxx"]),
            "{money}": random.choice(self.vocab["money"]),
            "{spam_account}": random.choice(self.vocab["spam_accounts"]),
            "{years}": random.choice(self.vocab["years"]),
            "{self_harm_action}": random.choice(self.vocab["self_harm_actions"]),
            "{issue}": random.choice(["politics", "immigration", "climate", "economy"]),
            "{conspiracy_theory}": random.choice(self.vocab["conspiracy_theories"]),
            "{misinformation}": random.choice(self.vocab["misinformation"]),
            "{health_miracle}": random.choice(self.vocab["health_miracles"]),
            "{fake_news}": random.choice(self.vocab["fake_news"]),
            "{unbelievable_claim}": random.choice(self.vocab["unbelievable_claims"]),
            "{positive_thing}": random.choice(self.vocab["positive_things"]),
            "{exercise}": random.choice(self.vocab["exercises"]),
            "{pet_name}": random.choice(self.vocab["pet_names"]),
            "{book_name}": random.choice(self.vocab["book_names"]),
            "{food}": random.choice(self.vocab["foods"]),
        }

        # Fill template
        filled = template
        for placeholder, value in replacements.items():
            filled = filled.replace(placeholder, value)

        return filled

    def _generate_post_id(self, text: str) -> str:
        """Generate unique ID for post"""
        return hashlib.md5(text.encode()).hexdigest()[:16]

    def generate_posts(self, n_posts: int = 10000) -> pd.DataFrame:
        """Generate n synthetic Instagram posts"""
        posts = []

        # Calculate how many safe vs violation posts
        safe_ratio = self.violation_categories["safe"]["weight"]
        n_safe = int(n_posts * safe_ratio)
        n_violations = n_posts - n_safe

        print(f"Generating {n_posts} posts:")
        print(f"  - Safe posts: {n_safe}")
        print(f"  - Violations: {n_violations}")

        # Generate safe posts
        safe_templates = self.violation_categories["safe"]["templates"]
        for i in range(n_safe):
            template = random.choice(safe_templates)
            text = self._fill_template(template, "safe")

            posts.append(
                {
                    "post_id": self._generate_post_id(text),
                    "text": text,
                    "label": 0,  # Not blocked
                    "violation_type": "safe",
                    "confidence": 1.0,  # Ground truth
                    "language": "en",
                    "hashtags": " ".join(
                        [f"#{word}" for word in text.split() if word.startswith("#")]
                    ),
                    "created_at": datetime.now()
                    - timedelta(days=random.randint(0, 365)),
                }
            )

        # Generate violation posts
        violation_categories = {
            k: v for k, v in self.violation_categories.items() if k != "safe"
        }

        for category, config in violation_categories.items():
            n_category = int(n_violations * config["weight"])
            templates = config["templates"]

            for i in range(n_category):
                template = random.choice(templates)
                text = self._fill_template(template, category)

                posts.append(
                    {
                        "post_id": self._generate_post_id(text),
                        "text": text,
                        "label": 1,  # Blocked
                        "violation_type": category,
                        "confidence": random.uniform(0.7, 1.0),  # Some ambiguity
                        "language": "en",
                        "hashtags": "",
                        "created_at": datetime.now()
                        - timedelta(days=random.randint(0, 365)),
                    }
                )

        # Shuffle posts
        random.shuffle(posts)

        return pd.DataFrame(posts)

    def add_noise(self, df: pd.DataFrame, noise_level: float = 0.05) -> pd.DataFrame:
        """Add realistic noise to the data"""
        noisy_df = df.copy()

        # Add typos to some texts
        mask = random.sample(range(len(noisy_df)), int(len(noisy_df) * noise_level))
        for idx in mask:
            text = noisy_df.loc[idx, "text"]
            if len(text) > 5:
                pos = random.randint(0, len(text) - 1)
                text = text[:pos] + text[pos + 1 :]  # Remove random character
                noisy_df.loc[idx, "text"] = text

        # Flip some labels (simulate borderline cases)
        mask = random.sample(
            range(len(noisy_df)), int(len(noisy_df) * noise_level * 0.3)
        )
        noisy_df.loc[mask, "label"] = 1 - noisy_df.loc[mask, "label"]
        noisy_df.loc[mask, "confidence"] = 0.6  # Low confidence for flipped ones

        return noisy_df

    def save_datasets(self, df: pd.DataFrame, version: str = "v1"):
        """Save train/val/test splits"""
        # Shuffle and split
        df = df.sample(frac=1).reset_index(drop=True)

        n = len(df)
        n_train = int(0.7 * n)
        n_val = int(0.15 * n)

        train_df = df[:n_train]
        val_df = df[n_train : n_train + n_val]
        test_df = df[n_train + n_val :]

        # Save with version
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        base_path = self.output_dir / f"instagram_{version}_{timestamp}"

        train_df.to_csv(f"{base_path}_train.csv", index=False)
        val_df.to_csv(f"{base_path}_val.csv", index=False)
        test_df.to_csv(f"{base_path}_test.csv", index=False)

        # Save metadata
        metadata = {
            "version": version,
            "timestamp": timestamp,
            "total_posts": n,
            "train_posts": len(train_df),
            "val_posts": len(val_df),
            "test_posts": len(test_df),
            "label_distribution": df["label"].value_counts().to_dict(),
            "violation_distribution": df["violation_type"].value_counts().to_dict(),
        }

        with open(f"{base_path}_metadata.json", "w") as f:
            json.dump(metadata, f, indent=2)

        print(f"\n✅ Dataset saved: {base_path}")
        print(f"   Train: {len(train_df)} | Val: {len(val_df)} | Test: {len(test_df)}")

        return {
            "train": train_df,
            "val": val_df,
            "test": test_df,
            "metadata": metadata,
            "path": base_path,
        }


def main():
    """Main execution"""
    print("🚀 Starting synthetic data generation...")

    # Initialize generator
    generator = InstagramDataGenerator(seed=42)

    # Generate 10,000 posts
    df = generator.generate_posts(n_posts=10000)

    # Add some noise to make it realistic
    df = generator.add_noise(df, noise_level=0.05)

    # Save datasets
    result = generator.save_datasets(df, version="v1")

    # Print summary
    print("\n📊 Dataset Summary:")
    print(f"   Total posts: {result['metadata']['total_posts']}")
    print(f"   Safe posts: {result['metadata']['label_distribution'][0]}")
    print(f"   Violations: {result['metadata']['label_distribution'][1]}")
    print("\n   Violation breakdown:")
    for vtype, count in result["metadata"]["violation_distribution"].items():
        if vtype != "safe":
            print(f"     - {vtype}: {count}")

    # Show examples
    print("\n📝 Example posts:")
    for i in range(5):
        example = df.iloc[i]
        print(
            f"\n  [{i+1}] {'🔴 BLOCKED' if example['label']==1 else '🟢 SAFE'} ({example['violation_type']})"
        )
        print(f"      {example['text'][:100]}...")


if __name__ == "__main__":
    main()
