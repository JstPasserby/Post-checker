# scripts/generate_data.sh
#!/bin/bash

echo "🔧 Pre-Post Checker - Data Generation"
echo "======================================"

# Activate virtual environment
source venv/bin/activate

# Set Python path
export PYTHONPATH=$PYTHONPATH:$(pwd)

# Generate data
python src/ml/data/synthetic_generator.py

# Show output location
echo ""
echo "📁 Data saved in: data/synthetic/"
ls -la data/synthetic/
