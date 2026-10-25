# scripts/visualize_data.py - SEPARATE visualization tool
# !/usr/bin/env python3
"""
Standalone data visualization tool
Run: python scripts/visualize_data.py [path_to_csv]
"""

import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns
from pathlib import Path

# import sys
import argparse


class DataVisualizer:
    def __init__(self, data_path=None):
        self.data_dir = Path("data/synthetic")
        self.load_data(data_path)

    def load_data(self, specific_path=None):
        if specific_path:
            self.df = pd.read_csv(specific_path)
        else:
            # Load most recent train file
            csv_files = sorted(self.data_dir.glob("*train.csv"))
            if not csv_files:
                raise FileNotFoundError("No training data found in data/synthetic/")
            latest = csv_files[-1]
            print(f"📊 Loading: {latest}")
            self.df = pd.read_csv(latest)

    def create_full_report(self):
        """Generate comprehensive visualization report"""
        # fig = plt.figure(figsize=(20, 12))

        # 1. Label distribution
        ax1 = plt.subplot(3, 3, 1)
        self.df["label"].value_counts().plot(
            kind="bar", color=["#2ecc71", "#e74c3c"], ax=ax1
        )
        ax1.set_title("Label Distribution\n(0=Safe, 1=Violation)", fontsize=12)
        ax1.set_xlabel("Label")
        ax1.set_ylabel("Count")

        # 2. Violation type distribution
        ax2 = plt.subplot(3, 3, 2)
        vcounts = self.df["violation_type"].value_counts()
        vcounts.plot(kind="bar", ax=ax2, color="#3498db")
        ax2.set_title("Violation Type Distribution", fontsize=12)
        ax2.tick_params(axis="x", rotation=45)

        # 3. Confidence distribution
        ax3 = plt.subplot(3, 3, 3)
        self.df["confidence"].hist(bins=20, ax=ax3, color="#9b59b6", alpha=0.7)
        ax3.set_title("Confidence Distribution", fontsize=12)
        ax3.set_xlabel("Confidence")
        ax3.set_ylabel("Count")

        # 4. Text length by label
        ax4 = plt.subplot(3, 3, 4)
        self.df[self.df["label"] == 0]["text"].str.len().hist(
            bins=30, alpha=0.5, label="Safe", color="#2ecc71", ax=ax4
        )
        self.df[self.df["label"] == 1]["text"].str.len().hist(
            bins=30, alpha=0.5, label="Violation", color="#e74c3c", ax=ax4
        )
        ax4.set_title("Text Length Distribution", fontsize=12)
        ax4.set_xlabel("Length")
        ax4.set_ylabel("Count")
        ax4.legend()

        # 5. Violation subcategories heatmap
        ax5 = plt.subplot(3, 3, 5)
        vtype_by_label = pd.crosstab(
            self.df["violation_type"], self.df["label"], normalize="index"
        )
        sns.heatmap(vtype_by_label, annot=True, fmt=".2f", cmap="YlOrRd", ax=ax5)
        ax5.set_title("Violation Type × Label Heatmap", fontsize=12)

        # 6. Time distribution (if created_at exists)
        if "created_at" in self.df.columns:
            ax6 = plt.subplot(3, 3, 6)
            self.df["created_at"] = pd.to_datetime(self.df["created_at"])
            self.df.set_index("created_at")["label"].resample("M").count().plot(
                ax=ax6, marker="o", color="#e67e22"
            )
            ax6.set_title("Posts Over Time", fontsize=12)
            ax6.set_xlabel("Date")
            ax6.set_ylabel("Count")

        # 7. Top hashtags (if any)
        ax7 = plt.subplot(3, 3, 7)
        all_hashtags = []
        for tags in self.df["hashtags"].dropna():
            all_hashtags.extend(tags.split())
        if all_hashtags:
            pd.Series(all_hashtags).value_counts().head(10).plot(
                kind="bar", ax=ax7, color="#1abc9c"
            )
            ax7.set_title("Top 10 Hashtags", fontsize=12)
            ax7.tick_params(axis="x", rotation=45)

        # 8. Sample posts table
        ax8 = plt.subplot(3, 3, 8)
        ax8.axis("tight")
        ax8.axis("off")
        sample = self.df.sample(min(5, len(self.df)))[
            ["label", "violation_type", "text"]
        ]
        table = ax8.table(
            cellText=sample.values,
            colLabels=sample.columns,
            cellLoc="left",
            loc="center",
        )
        table.auto_set_font_size(False)
        table.set_fontsize(8)
        ax8.set_title("Sample Posts", fontsize=12)

        # 9. Summary stats
        ax9 = plt.subplot(3, 3, 9)
        ax9.axis("off")
        stats_text = f"""
        📊 DATASET SUMMARY
        ─────────────────
        Total posts: {len(self.df):,}
        Safe posts: {len(self.df[self.df['label']==0]):,}
        Violations: {len(self.df[self.df['label']==1]):,}

        Violation Rate: {self.df['label'].mean()*100:.1f}%
        Avg Confidence: {self.df['confidence'].mean():.2f}

        Categories: {self.df['violation_type'].nunique()}
        Languages: {self.df['language'].nunique() if 'language' in self.df.columns else 1}
        """
        ax9.text(
            0.1,
            0.9,
            stats_text,
            fontsize=10,
            verticalalignment="top",
            fontfamily="monospace",
        )

        plt.tight_layout()

        # Save report
        output_path = (
            self.data_dir
            / f"visualization_{pd.Timestamp.now().strftime('%Y%m%d_%H%M%S')}.png"
        )
        plt.savefig(output_path, dpi=150, bbox_inches="tight")
        print(f"✅ Report saved: {output_path}")
        plt.show()


def main():
    parser = argparse.ArgumentParser(description="Visualize synthetic Instagram data")
    parser.add_argument("--file", "-f", help="Specific CSV file to visualize")
    args = parser.parse_args()

    visualizer = DataVisualizer(args.file)
    visualizer.create_full_report()


if __name__ == "__main__":
    main()
