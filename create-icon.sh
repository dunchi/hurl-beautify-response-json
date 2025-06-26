#!/bin/bash

# Hurl 아이콘 생성 스크립트
echo "Hurl 아이콘을 생성합니다..."

# 임시 PNG 생성 (ImageMagick이 있다면)
if command -v convert >/dev/null 2>&1; then
    echo "ImageMagick을 사용하여 아이콘 생성 중..."
    convert -size 512x512 xc:"#2d3748" \
        -fill "#4fd1c7" \
        -font Helvetica-Bold \
        -pointsize 200 \
        -gravity center \
        -annotate +0+0 "H" \
        assets/hurl-512.png
    
    # macOS 내장 도구로 PNG를 ICNS로 변환
    echo "PNG를 ICNS로 변환 중..."
    mkdir -p assets/hurl.iconset
    
    # 다양한 크기로 생성
    convert assets/hurl-512.png -resize 16x16 assets/hurl.iconset/icon_16x16.png
    convert assets/hurl-512.png -resize 32x32 assets/hurl.iconset/icon_16x16@2x.png
    convert assets/hurl-512.png -resize 32x32 assets/hurl.iconset/icon_32x32.png
    convert assets/hurl-512.png -resize 64x64 assets/hurl.iconset/icon_32x32@2x.png
    convert assets/hurl-512.png -resize 128x128 assets/hurl.iconset/icon_128x128.png
    convert assets/hurl-512.png -resize 256x256 assets/hurl.iconset/icon_128x128@2x.png
    convert assets/hurl-512.png -resize 256x256 assets/hurl.iconset/icon_256x256.png
    convert assets/hurl-512.png -resize 512x512 assets/hurl.iconset/icon_256x256@2x.png
    convert assets/hurl-512.png -resize 512x512 assets/hurl.iconset/icon_512x512.png
    convert assets/hurl-512.png -resize 1024x1024 assets/hurl.iconset/icon_512x512@2x.png
    
    # iconutil로 ICNS 생성 (macOS 내장 도구)
    iconutil -c icns assets/hurl.iconset -o assets/icon.icns
    
    # 임시 파일 정리
    rm -rf assets/hurl.iconset
    rm assets/hurl-512.png
    
    echo "사용자 정의 Hurl 아이콘이 생성되었습니다!"
else
    echo "ImageMagick이 설치되지 않아 기본 아이콘을 사용합니다."
    echo "brew install imagemagick으로 설치하면 사용자 정의 아이콘을 만들 수 있습니다."
fi
