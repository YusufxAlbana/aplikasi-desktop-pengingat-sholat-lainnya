package main

import (
	"context"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"net/url"

	"github.com/gen2brain/beeep"
	"github.com/wailsapp/wails/v2/pkg/runtime"
)

// App struct
type App struct {
	ctx        context.Context
	widgetMode bool
}

// NewApp creates a new App application struct
func NewApp() *App {
	return &App{}
}

func (a *App) startup(ctx context.Context) {
	a.ctx = ctx
}

// SetWidgetMode enables/disables always on top and prevents closing
func (a *App) SetWidgetMode(enable bool) {
	a.widgetMode = enable
	runtime.WindowSetAlwaysOnTop(a.ctx, enable)
}

// onBeforeClose is called when the user attempts to close the window.
// Returning true prevents the window from closing.
func (a *App) onBeforeClose(ctx context.Context) bool {
	return a.widgetMode
}

type PrayerResult struct {
	Timings   map[string]string `json:"timings"`
	Latitude  float64           `json:"latitude"`
	Longitude float64           `json:"longitude"`
}

type AladhanResponse struct {
	Code   int    `json:"code"`
	Status string `json:"status"`
	Data   struct {
		Timings map[string]string `json:"timings"`
		Meta    struct {
			Latitude  float64 `json:"latitude"`
			Longitude float64 `json:"longitude"`
		} `json:"meta"`
	} `json:"data"`
}

func (a *App) GetPrayerTimes(city string, country string) (PrayerResult, error) {
	apiURL := fmt.Sprintf("https://api.aladhan.com/v1/timingsByCity?city=%s&country=%s&method=20", url.QueryEscape(city), url.QueryEscape(country))

	resp, err := http.Get(apiURL)
	if err != nil {
		return PrayerResult{}, err
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		return PrayerResult{}, fmt.Errorf("failed to fetch data: HTTP %d", resp.StatusCode)
	}

	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return PrayerResult{}, err
	}

	var data AladhanResponse
	if err := json.Unmarshal(body, &data); err != nil {
		return PrayerResult{}, err
	}

	return PrayerResult{
		Timings:   data.Data.Timings,
		Latitude:  data.Data.Meta.Latitude,
		Longitude: data.Data.Meta.Longitude,
	}, nil
}

type QiblaResponse struct {
	Code int `json:"code"`
	Data struct {
		Latitude  float64 `json:"latitude"`
		Longitude float64 `json:"longitude"`
		Direction float64 `json:"direction"`
	} `json:"data"`
}

func (a *App) GetQibla(lat float64, lng float64) (float64, error) {
	apiURL := fmt.Sprintf("https://api.aladhan.com/v1/qibla/%f/%f", lat, lng)
	resp, err := http.Get(apiURL)
	if err != nil {
		return 0, err
	}
	defer resp.Body.Close()

	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return 0, err
	}

	var data QiblaResponse
	if err := json.Unmarshal(body, &data); err != nil {
		return 0, err
	}

	return data.Data.Direction, nil
}

type Surah struct {
	Number         int    `json:"number"`
	Name           string `json:"name"`
	EnglishName    string `json:"englishName"`
	RevelationType string `json:"revelationType"`
}

type QuranSurahsResponse struct {
	Data []Surah `json:"data"`
}

func (a *App) GetQuranSurahs() ([]Surah, error) {
	resp, err := http.Get("https://api.alquran.cloud/v1/surah")
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()

	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return nil, err
	}

	var data QuranSurahsResponse
	if err := json.Unmarshal(body, &data); err != nil {
		return nil, err
	}

	return data.Data, nil
}

type Ayah struct {
	Number int    `json:"numberInSurah"`
	Text   string `json:"text"`
	Audio  string `json:"audio"`
}

type SurahDetail struct {
	Number      int    `json:"number"`
	Name        string `json:"name"`
	EnglishName string `json:"englishName"`
	Ayahs       []Ayah `json:"ayahs"`
}

type QuranSurahDetailResponse struct {
	Data SurahDetail `json:"data"`
}

func (a *App) GetQuranSurah(number int) (SurahDetail, error) {
	apiURL := fmt.Sprintf("https://api.alquran.cloud/v1/surah/%d/ar.alafasy", number)
	resp, err := http.Get(apiURL)
	if err != nil {
		return SurahDetail{}, err
	}
	defer resp.Body.Close()

	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return SurahDetail{}, err
	}

	var data QuranSurahDetailResponse
	if err := json.Unmarshal(body, &data); err != nil {
		return SurahDetail{}, err
	}

	return data.Data, nil
}

// SendNotification triggers a desktop notification.
func (a *App) SendNotification(title string, message string) error {
	err := beeep.Notify(title, message, "")
	if err != nil {
		return err
	}
	return nil
}
