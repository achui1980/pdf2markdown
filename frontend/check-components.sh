#!/bin/bash

echo "检查前端组件导入..."

# 检查关键组件文件是否存在
components=(
    "src/components/common/ErrorBoundary.js"
    "src/components/common/NotificationManager.js" 
    "src/components/common/StepIndicator.js"
    "src/components/common/GlobalDragOverlay.js"
    "src/components/common/HelpButton.js"
    "src/components/common/SmartHints.js"
    "src/components/common/UserPreferences.js"
    "src/components/common/Toast.js"
    "src/components/upload/FileUploader.js"
    "src/components/processing/ProcessingView.js"
    "src/components/processing/ProcessingStatusCard.js"
    "src/components/results/ResultsView.js"
    "src/components/results/QuickActions.js"
    "src/hooks/useFileUpload.js"
    "src/hooks/useGlobalDragAndDrop.js"
    "src/hooks/useKeyboardShortcuts.js"
    "src/hooks/useToast.js"
    "src/utils/fileUtils.js"
)

missing_files=()

for file in "${components[@]}"; do
    if [ ! -f "$file" ]; then
        missing_files+=("$file")
        echo "❌ 缺失: $file"
    else
        echo "✅ 存在: $file"
    fi
done

if [ ${#missing_files[@]} -eq 0 ]; then
    echo ""
    echo "🎉 所有组件文件都存在！"
    echo "现在可以尝试启动前端服务: npm start"
else
    echo ""
    echo "⚠️  发现 ${#missing_files[@]} 个缺失的文件，需要创建这些组件。"
fi
